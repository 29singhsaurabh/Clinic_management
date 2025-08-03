import {
  users,
  patients,
  appointments,
  medicalRecords,
  type User,
  type InsertUser,
  type Patient,
  type InsertPatient,
  type Appointment,
  type InsertAppointment,
  type MedicalRecord,
  type InsertMedicalRecord,
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, gte, lte, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Patient operations
  getPatients(
    search?: string,
    gender?: string,
    minAge?: number,
    maxAge?: number,
    limit?: number,
    offset?: number
  ): Promise<{ patients: Patient[]; total: number }>;
  getPatientById(id: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient>;
  deletePatient(id: string): Promise<void>;
  
  // Appointment operations
  getAppointments(
    date?: string,
    status?: string,
    patientId?: string,
    limit?: number,
    offset?: number
  ): Promise<{ appointments: (Appointment & { patient: Patient; doctor?: User })[]; total: number }>;
  getAppointmentById(id: string): Promise<(Appointment & { patient: Patient; doctor?: User }) | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  deleteAppointment(id: string): Promise<void>;
  
  // Medical record operations
  getMedicalRecords(patientId: string): Promise<MedicalRecord[]>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    totalPatients: number;
    todayAppointments: number;
    monthlyRevenue: number;
    activeStaff: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getPatients(
    search?: string,
    gender?: string,
    minAge?: number,
    maxAge?: number,
    limit = 10,
    offset = 0
  ): Promise<{ patients: Patient[]; total: number }> {
    const conditions = [];
    
    if (search) {
      conditions.push(
        sql`(${patients.fullName} ILIKE ${`%${search}%`} OR ${patients.mobile} ILIKE ${`%${search}%`} OR ${patients.patientId} ILIKE ${`%${search}%`})`
      );
    }
    
    if (gender) {
      conditions.push(eq(patients.gender, gender as any));
    }
    
    // Age filtering would require more complex date calculations
    conditions.push(eq(patients.isActive, true));
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const [patientsResult, totalResult] = await Promise.all([
      db.select().from(patients)
        .where(whereClause)
        .orderBy(desc(patients.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(patients).where(whereClause)
    ]);
    
    return {
      patients: patientsResult,
      total: totalResult[0]?.count || 0
    };
  }

  async getPatientById(id: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    // Generate patient ID
    const patientCount = await db.select({ count: sql<number>`count(*)` }).from(patients);
    const patientId = `PAT${String(patientCount[0].count + 1).padStart(3, '0')}`;
    
    const [patient] = await db.insert(patients).values({
      ...insertPatient,
      patientId,
    }).returning();
    return patient;
  }

  async updatePatient(id: string, updateData: Partial<InsertPatient>): Promise<Patient> {
    const [patient] = await db
      .update(patients)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();
    return patient;
  }

  async deletePatient(id: string): Promise<void> {
    await db.update(patients).set({ isActive: false }).where(eq(patients.id, id));
  }

  async getAppointments(
    date?: string,
    status?: string,
    patientId?: string,
    limit = 10,
    offset = 0
  ): Promise<{ appointments: (Appointment & { patient: Patient; doctor?: User })[]; total: number }> {
    const conditions = [];
    
    if (date) {
      conditions.push(eq(appointments.appointmentDate, date));
    }
    
    if (status) {
      conditions.push(eq(appointments.status, status as any));
    }
    
    if (patientId) {
      conditions.push(eq(appointments.patientId, patientId));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const [appointmentsResult, totalResult] = await Promise.all([
      db.select({
        appointment: appointments,
        patient: patients,
        doctor: users,
      })
        .from(appointments)
        .leftJoin(patients, eq(appointments.patientId, patients.id))
        .leftJoin(users, eq(appointments.doctorId, users.id))
        .where(whereClause)
        .orderBy(desc(appointments.appointmentDate), appointments.appointmentTime)
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(appointments).where(whereClause)
    ]);
    
    return {
      appointments: appointmentsResult.map(row => ({
        ...row.appointment,
        patient: row.patient!,
        doctor: row.doctor || undefined,
      })),
      total: totalResult[0]?.count || 0
    };
  }

  async getAppointmentById(id: string): Promise<(Appointment & { patient: Patient; doctor?: User }) | undefined> {
    const [result] = await db.select({
      appointment: appointments,
      patient: patients,
      doctor: users,
    })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(users, eq(appointments.doctorId, users.id))
      .where(eq(appointments.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.appointment,
      patient: result.patient!,
      doctor: result.doctor || undefined,
    };
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    // Generate appointment ID
    const appointmentCount = await db.select({ count: sql<number>`count(*)` }).from(appointments);
    const appointmentId = `APT${String(appointmentCount[0].count + 1).padStart(3, '0')}`;
    
    const [appointment] = await db.insert(appointments).values({
      ...insertAppointment,
      appointmentId,
    }).returning();
    return appointment;
  }

  async updateAppointment(id: string, updateData: Partial<InsertAppointment>): Promise<Appointment> {
    const [appointment] = await db
      .update(appointments)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async deleteAppointment(id: string): Promise<void> {
    await db.delete(appointments).where(eq(appointments.id, id));
  }

  async getMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    return await db.select().from(medicalRecords)
      .where(eq(medicalRecords.patientId, patientId))
      .orderBy(desc(medicalRecords.visitDate));
  }

  async createMedicalRecord(insertRecord: InsertMedicalRecord): Promise<MedicalRecord> {
    const [record] = await db.insert(medicalRecords).values(insertRecord).returning();
    return record;
  }

  async getDashboardStats(): Promise<{
    totalPatients: number;
    todayAppointments: number;
    monthlyRevenue: number;
    activeStaff: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    
    const [
      totalPatientsResult,
      todayAppointmentsResult,
      activeStaffResult
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(patients).where(eq(patients.isActive, true)),
      db.select({ count: sql<number>`count(*)` }).from(appointments).where(eq(appointments.appointmentDate, today)),
      db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.isActive, true)),
    ]);
    
    return {
      totalPatients: totalPatientsResult[0]?.count || 0,
      todayAppointments: todayAppointmentsResult[0]?.count || 0,
      monthlyRevenue: 45230, // This would be calculated from billing/payments table
      activeStaff: activeStaffResult[0]?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
