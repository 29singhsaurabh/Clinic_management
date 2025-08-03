var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";
import session from "express-session";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  appointmentStatusEnum: () => appointmentStatusEnum,
  appointmentTypeEnum: () => appointmentTypeEnum,
  appointments: () => appointments,
  appointmentsRelations: () => appointmentsRelations,
  bloodGroupEnum: () => bloodGroupEnum,
  genderEnum: () => genderEnum,
  insertAppointmentSchema: () => insertAppointmentSchema,
  insertMedicalRecordSchema: () => insertMedicalRecordSchema,
  insertPatientSchema: () => insertPatientSchema,
  insertUserSchema: () => insertUserSchema,
  medicalRecords: () => medicalRecords,
  medicalRecordsRelations: () => medicalRecordsRelations,
  patients: () => patients,
  patientsRelations: () => patientsRelations,
  userRoleEnum: () => userRoleEnum,
  users: () => users
});
import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  date,
  pgEnum,
  boolean
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var genderEnum = pgEnum("gender", ["male", "female", "other"]);
var bloodGroupEnum = pgEnum("blood_group", [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-"
]);
var appointmentStatusEnum = pgEnum("appointment_status", [
  "scheduled",
  "completed",
  "cancelled",
  "rescheduled"
]);
var appointmentTypeEnum = pgEnum("appointment_type", [
  "consultation",
  "follow-up",
  "checkup",
  "emergency",
  "vaccination"
]);
var userRoleEnum = pgEnum("user_role", ["admin", "doctor", "nurse", "receptionist"]);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }),
  role: userRoleEnum("role").notNull().default("admin"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var patients = pgTable("patients", {
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
  updatedAt: timestamp("updated_at").defaultNow()
});
var appointments = pgTable("appointments", {
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
  updatedAt: timestamp("updated_at").defaultNow()
});
var medicalRecords = pgTable("medical_records", {
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
  createdAt: timestamp("created_at").defaultNow()
});
var patientsRelations = relations(patients, ({ many }) => ({
  appointments: many(appointments),
  medicalRecords: many(medicalRecords)
}));
var appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id]
  }),
  doctor: one(users, {
    fields: [appointments.doctorId],
    references: [users.id]
  })
}));
var medicalRecordsRelations = relations(medicalRecords, ({ one }) => ({
  patient: one(patients, {
    fields: [medicalRecords.patientId],
    references: [patients.id]
  }),
  appointment: one(appointments, {
    fields: [medicalRecords.appointmentId],
    references: [appointments.id]
  }),
  doctor: one(users, {
    fields: [medicalRecords.doctorId],
    references: [users.id]
  })
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  patientId: true,
  createdAt: true,
  updatedAt: true
}).extend({
  email: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  medicalHistory: z.string().optional().or(z.literal("")),
  currentMedications: z.string().optional().or(z.literal("")),
  allergies: z.string().optional().or(z.literal("")),
  emergencyContactName: z.string().optional().or(z.literal("")),
  emergencyContactPhone: z.string().optional().or(z.literal("")),
  emergencyContactRelation: z.string().optional().or(z.literal(""))
});
var insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  appointmentId: true,
  createdAt: true,
  updatedAt: true
}).extend({
  notes: z.string().optional().or(z.literal(""))
});
var insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, desc, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async getPatients(search, gender, minAge, maxAge, limit = 10, offset = 0) {
    const conditions = [];
    if (search) {
      conditions.push(
        sql2`(${patients.fullName} ILIKE ${`%${search}%`} OR ${patients.mobile} ILIKE ${`%${search}%`} OR ${patients.patientId} ILIKE ${`%${search}%`})`
      );
    }
    if (gender) {
      conditions.push(eq(patients.gender, gender));
    }
    conditions.push(eq(patients.isActive, true));
    const whereClause = conditions.length > 0 ? and(...conditions) : void 0;
    const [patientsResult, totalResult] = await Promise.all([
      db.select().from(patients).where(whereClause).orderBy(desc(patients.createdAt)).limit(limit).offset(offset),
      db.select({ count: sql2`count(*)` }).from(patients).where(whereClause)
    ]);
    return {
      patients: patientsResult,
      total: totalResult[0]?.count || 0
    };
  }
  async getPatientById(id) {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }
  async createPatient(insertPatient) {
    const patientCount = await db.select({ count: sql2`count(*)` }).from(patients);
    const patientId = `PAT${String(patientCount[0].count + 1).padStart(3, "0")}`;
    const [patient] = await db.insert(patients).values({
      ...insertPatient,
      patientId
    }).returning();
    return patient;
  }
  async updatePatient(id, updateData) {
    const [patient] = await db.update(patients).set({ ...updateData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(patients.id, id)).returning();
    return patient;
  }
  async deletePatient(id) {
    await db.update(patients).set({ isActive: false }).where(eq(patients.id, id));
  }
  async getAppointments(date2, status, patientId, limit = 10, offset = 0) {
    const conditions = [];
    if (date2) {
      conditions.push(eq(appointments.appointmentDate, date2));
    }
    if (status) {
      conditions.push(eq(appointments.status, status));
    }
    if (patientId) {
      conditions.push(eq(appointments.patientId, patientId));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : void 0;
    const [appointmentsResult, totalResult] = await Promise.all([
      db.select({
        appointment: appointments,
        patient: patients,
        doctor: users
      }).from(appointments).leftJoin(patients, eq(appointments.patientId, patients.id)).leftJoin(users, eq(appointments.doctorId, users.id)).where(whereClause).orderBy(desc(appointments.appointmentDate), appointments.appointmentTime).limit(limit).offset(offset),
      db.select({ count: sql2`count(*)` }).from(appointments).where(whereClause)
    ]);
    return {
      appointments: appointmentsResult.map((row) => ({
        ...row.appointment,
        patient: row.patient,
        doctor: row.doctor || void 0
      })),
      total: totalResult[0]?.count || 0
    };
  }
  async getAppointmentById(id) {
    const [result] = await db.select({
      appointment: appointments,
      patient: patients,
      doctor: users
    }).from(appointments).leftJoin(patients, eq(appointments.patientId, patients.id)).leftJoin(users, eq(appointments.doctorId, users.id)).where(eq(appointments.id, id));
    if (!result) return void 0;
    return {
      ...result.appointment,
      patient: result.patient,
      doctor: result.doctor || void 0
    };
  }
  async createAppointment(insertAppointment) {
    const appointmentCount = await db.select({ count: sql2`count(*)` }).from(appointments);
    const appointmentId = `APT${String(appointmentCount[0].count + 1).padStart(3, "0")}`;
    const [appointment] = await db.insert(appointments).values({
      ...insertAppointment,
      appointmentId
    }).returning();
    return appointment;
  }
  async updateAppointment(id, updateData) {
    const [appointment] = await db.update(appointments).set({ ...updateData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(appointments.id, id)).returning();
    return appointment;
  }
  async deleteAppointment(id) {
    await db.delete(appointments).where(eq(appointments.id, id));
  }
  async getMedicalRecords(patientId) {
    return await db.select().from(medicalRecords).where(eq(medicalRecords.patientId, patientId)).orderBy(desc(medicalRecords.visitDate));
  }
  async createMedicalRecord(insertRecord) {
    const [record] = await db.insert(medicalRecords).values(insertRecord).returning();
    return record;
  }
  async getDashboardStats() {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const startOfMonth = new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1).toISOString().split("T")[0];
    const [
      totalPatientsResult,
      todayAppointmentsResult,
      activeStaffResult
    ] = await Promise.all([
      db.select({ count: sql2`count(*)` }).from(patients).where(eq(patients.isActive, true)),
      db.select({ count: sql2`count(*)` }).from(appointments).where(eq(appointments.appointmentDate, today)),
      db.select({ count: sql2`count(*)` }).from(users).where(eq(users.isActive, true))
    ]);
    return {
      totalPatients: totalPatientsResult[0]?.count || 0,
      todayAppointments: todayAppointmentsResult[0]?.count || 0,
      monthlyRevenue: 45230,
      // This would be calculated from billing/payments table
      activeStaff: activeStaffResult[0]?.count || 0
    };
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import bcrypt from "bcrypt";
import { z as z2 } from "zod";
var loginSchema = z2.object({
  username: z2.string().min(1, "Username is required"),
  password: z2.string().min(1, "Password is required")
});
var requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};
async function registerRoutes(app2) {
  const defaultUser = await storage.getUserByUsername("admin");
  if (!defaultUser) {
    await storage.createUser({
      username: "admin",
      password: await bcrypt.hash("admin123", 10),
      fullName: "Dr. Administrator",
      email: "admin@clinic.com",
      role: "admin"
    });
  }
  app2.post("/api/auth/login", async (req, res) => {
    try {
      console.log("Login request body:", req.body);
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(username);
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.session.userId = user.id;
      req.session.username = user.username;
      res.json({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: error.errors
        });
      }
      res.status(400).json({ message: "Invalid request data" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  app2.get("/api/auth/user", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.session.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });
  app2.get("/api/patients", requireAuth, async (req, res) => {
    try {
      const {
        search,
        gender,
        minAge,
        maxAge,
        page = "1",
        limit = "10"
      } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const result = await storage.getPatients(
        search,
        gender === "all" ? void 0 : gender,
        minAge ? parseInt(minAge) : void 0,
        maxAge ? parseInt(maxAge) : void 0,
        parseInt(limit),
        offset
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });
  app2.get("/api/patients/:id", requireAuth, async (req, res) => {
    try {
      const patient = await storage.getPatientById(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  });
  app2.post("/api/patients", requireAuth, async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid patient data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create patient" });
    }
  });
  app2.put("/api/patients/:id", requireAuth, async (req, res) => {
    try {
      const patientData = insertPatientSchema.partial().parse(req.body);
      const patient = await storage.updatePatient(req.params.id, patientData);
      res.json(patient);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid patient data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update patient" });
    }
  });
  app2.delete("/api/patients/:id", requireAuth, async (req, res) => {
    try {
      await storage.deletePatient(req.params.id);
      res.json({ message: "Patient deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete patient" });
    }
  });
  app2.get("/api/appointments", requireAuth, async (req, res) => {
    try {
      const {
        date: date2,
        status,
        patientId,
        page = "1",
        limit = "10"
      } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const result = await storage.getAppointments(
        date2,
        status === "all" ? void 0 : status,
        patientId,
        parseInt(limit),
        offset
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });
  app2.get("/api/appointments/:id", requireAuth, async (req, res) => {
    try {
      const appointment = await storage.getAppointmentById(req.params.id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointment" });
    }
  });
  app2.post("/api/appointments", requireAuth, async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });
  app2.put("/api/appointments/:id", requireAuth, async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await storage.updateAppointment(req.params.id, appointmentData);
      res.json(appointment);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });
  app2.delete("/api/appointments/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteAppointment(req.params.id);
      res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });
  app2.get("/api/patients/:patientId/medical-records", requireAuth, async (req, res) => {
    try {
      const records = await storage.getMedicalRecords(req.params.patientId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch medical records" });
    }
  });
  app2.post("/api/medical-records", requireAuth, async (req, res) => {
    try {
      const recordData = insertMedicalRecordSchema.parse(req.body);
      const record = await storage.createMedicalRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid medical record data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create medical record" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(session({
  secret: process.env.SESSION_SECRET || "clinic-management-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1e3,
    // 24 hours
    httpOnly: true
  }
}));
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
