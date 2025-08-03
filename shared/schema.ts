import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  date,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const bloodGroupEnum = pgEnum("blood_group", [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
]);
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "scheduled", "completed", "cancelled", "rescheduled"
]);
export const appointmentTypeEnum = pgEnum("appointment_type", [
  "consultation", "follow-up", "checkup", "emergency", "vaccination"
]);
export const userRoleEnum = pgEnum("user_role", ["admin", "doctor", "nurse", "receptionist"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }),
  role: userRoleEnum("role").notNull().default("admin"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Patients table
export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id", { length: 20 }).notNull().unique(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: genderEnum("gender").notNull(),
  bloodGroup: bloodGroupEnum("blood_group"),
  mobile: varchar("mobile", { length: 15 }).notNull(),
  email: varchar("email", { length: 100 }),
  address: text("address"),
  medicalHistory: text("medical_history"),
  currentMedications: text("current_medications"),
  allergies: text("allergies"),
  emergencyContactName: varchar("emergency_contact_name", { length: 100 }),
  emergencyContactPhone: varchar("emergency_contact_phone", { length: 15 }),
  emergencyContactRelation: varchar("emergency_contact_relation", { length: 50 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  appointmentId: varchar("appointment_id", { length: 20 }).notNull().unique(),
  patientId: varchar("patient_id").notNull(),
  doctorId: varchar("doctor_id"),
  appointmentDate: date("appointment_date").notNull(),
  appointmentTime: varchar("appointment_time", { length: 10 }).notNull(),
  type: appointmentTypeEnum("type").notNull(),
  status: appointmentStatusEnum("status").notNull().default("scheduled"),
  notes: text("notes"),
  diagnosis: text("diagnosis"),
  prescription: text("prescription"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical Records table
export const medicalRecords = pgTable("medical_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(),
  appointmentId: varchar("appointment_id"),
  doctorId: varchar("doctor_id"),
  visitDate: date("visit_date").notNull(),
  chiefComplaint: text("chief_complaint"),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  prescription: text("prescription"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const patientsRelations = relations(patients, ({ many }) => ({
  appointments: many(appointments),
  medicalRecords: many(medicalRecords),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  doctor: one(users, {
    fields: [appointments.doctorId],
    references: [users.id],
  }),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one }) => ({
  patient: one(patients, {
    fields: [medicalRecords.patientId],
    references: [patients.id],
  }),
  appointment: one(appointments, {
    fields: [medicalRecords.appointmentId],
    references: [appointments.id],
  }),
  doctor: one(users, {
    fields: [medicalRecords.doctorId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  patientId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  email: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  medicalHistory: z.string().optional().or(z.literal("")),
  currentMedications: z.string().optional().or(z.literal("")),
  allergies: z.string().optional().or(z.literal("")),
  emergencyContactName: z.string().optional().or(z.literal("")),
  emergencyContactPhone: z.string().optional().or(z.literal("")),
  emergencyContactRelation: z.string().optional().or(z.literal("")),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  appointmentId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  notes: z.string().optional().or(z.literal("")),
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
