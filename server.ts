import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || 'dr-pals-dental-clinic-super-secret-jwt-key-2026';

app.use(express.json({ limit: '10mb' }));

// Ensure data folder exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'clinic_data.json');

// Interface types
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: 'admin' | 'patient';
  avatar?: string;
  bloodGroup?: string;
  allergies?: string;
  medicalNotes?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  doctorNotes?: string;
  estimatedCost: number;
  paid: boolean;
  createdAt: string;
}

export interface DentalRecord {
  id: string;
  patientId: string;
  patientName: string;
  procedure: string;
  toothNumbers: string[];
  diagnosis: string;
  date: string;
  doctorName: string;
  prescriptions: { medicine: string; dosage: string; duration: string }[];
  cost: number;
  notes?: string;
}

export interface ToothCondition {
  number: number;
  status: 'healthy' | 'cavity' | 'treated' | 'crown' | 'implant' | 'missing';
  notes?: string;
}

export interface DentalService {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  badge?: string;
  icon: string;
}

interface DatabaseSchema {
  users: User[];
  appointments: Appointment[];
  records: DentalRecord[];
  toothCharts: Record<string, Record<number, ToothCondition>>;
  services: DentalService[];
}

// Initial default seed
function getInitialData(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync('Password123!', salt);

  const initialUsers: User[] = [
    {
      id: 'usr_admin_01',
      name: 'Dr. S. Pal (BDS, MDS Prosthodontics)',
      email: 'dr.pal@dentalclinic.com',
      passwordHash: defaultPasswordHash,
      phone: '+91 98201 23456',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Dr+S+Pal&backgroundColor=0284c7&textColor=ffffff',
      medicalNotes: 'Head Dental Surgeon & Implantologist. 15+ years experience.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_patient_01',
      name: 'Rahul Sharma',
      email: 'patient@example.com',
      passwordHash: defaultPasswordHash,
      phone: '+91 98765 43210',
      role: 'patient',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces',
      bloodGroup: 'O+',
      allergies: 'Penicillin (mild)',
      medicalNotes: 'Regular patient since 2023. Completed Teeth Whitening and Crown installation.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_patient_02',
      name: 'Priya Verma',
      email: 'priya.v@example.com',
      passwordHash: defaultPasswordHash,
      phone: '+91 98111 22334',
      role: 'patient',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
      bloodGroup: 'B+',
      allergies: 'None',
      medicalNotes: 'Undergoing smile makeover treatment with ceramic veneers.',
      createdAt: new Date().toISOString(),
    }
  ];

  const initialServices: DentalService[] = [
    {
      id: 'srv_whitening',
      title: 'Advanced Laser Teeth Whitening',
      description: 'Instant 4-8 shades lighter smile in a single 45-minute painless session with Philips Zoom technology.',
      price: '₹4,500',
      duration: '45 mins',
      category: 'Cosmetic',
      badge: 'Most Popular',
      icon: 'Sparkles',
    },
    {
      id: 'srv_rct',
      title: 'Single-Sitting Painless Root Canal',
      description: 'Precision rotary endodontics with 3D apex locator and digital X-ray verification for zero discomfort.',
      price: '₹3,500',
      duration: '60 mins',
      category: 'Endodontics',
      badge: 'Pain-Free',
      icon: 'Activity',
    },
    {
      id: 'srv_implants',
      title: 'Permanent Titanium Dental Implants',
      description: 'Bio-compatible Swiss titanium implants restoring natural bite strength with lifetime warranty.',
      price: '₹18,000',
      duration: '90 mins',
      category: 'Surgery',
      badge: 'Lifetime Warranty',
      icon: 'ShieldCheck',
    },
    {
      id: 'srv_smile',
      title: 'Digital Smile Restoration & Veneers',
      description: 'Ultra-thin E-max porcelain veneers custom designed to correct gaps, chips, and misalignment.',
      price: '₹7,500 / tooth',
      duration: '60 mins',
      category: 'Cosmetic',
      badge: 'Celebrity Choice',
      icon: 'Smile',
    },
    {
      id: 'srv_cleaning',
      title: 'Ultrasonic Scaling & Air-Flow Polishing',
      description: 'Deep calculus and stain removal, gum detox treatment, and fluoride varnish protective shield.',
      price: '₹1,200',
      duration: '30 mins',
      category: 'Preventive',
      icon: 'Zap',
    },
    {
      id: 'srv_aligners',
      title: 'Invisible Clear Aligners (Orthodontics)',
      description: 'Custom 3D-scanned transparent aligners that straighten teeth without metallic wires or brackets.',
      price: '₹35,000',
      duration: '45 mins',
      category: 'Orthodontics',
      badge: 'Discreet',
      icon: 'Layers',
    },
  ];

  const initialAppointments: Appointment[] = [
    {
      id: 'apt_101',
      patientId: 'usr_patient_01',
      patientName: 'Rahul Sharma',
      patientEmail: 'patient@example.com',
      patientPhone: '+91 98765 43210',
      service: 'Single-Sitting Painless Root Canal',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '10:30 AM',
      status: 'confirmed',
      notes: 'Follow-up for lower right molar treatment.',
      doctorNotes: 'Crown fitment check scheduled. Lower molar healed nicely.',
      estimatedCost: 3500,
      paid: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 'apt_102',
      patientId: 'usr_patient_02',
      patientName: 'Priya Verma',
      patientEmail: 'priya.v@example.com',
      patientPhone: '+91 98111 22334',
      service: 'Advanced Laser Teeth Whitening',
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      time: '02:00 PM',
      status: 'pending',
      notes: 'Consultation before upcoming wedding event.',
      doctorNotes: 'Assess baseline shade guide and gum health first.',
      estimatedCost: 4500,
      paid: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'apt_103',
      patientId: 'usr_patient_01',
      patientName: 'Rahul Sharma',
      patientEmail: 'patient@example.com',
      patientPhone: '+91 98765 43210',
      service: 'Ultrasonic Scaling & Air-Flow Polishing',
      date: new Date(Date.now() - 864000000).toISOString().split('T')[0],
      time: '11:00 AM',
      status: 'completed',
      notes: 'Routine 6-month preventive cleaning.',
      doctorNotes: 'Plaque removed completely. Fluoride protective coat applied.',
      estimatedCost: 1200,
      paid: true,
      createdAt: new Date(Date.now() - 950400000).toISOString(),
    },
    {
      id: 'apt_104',
      patientName: 'Anjali Desai',
      patientEmail: 'anjali.d@gmail.com',
      patientPhone: '+91 99200 44556',
      service: 'Permanent Titanium Dental Implants',
      date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
      time: '04:30 PM',
      status: 'confirmed',
      notes: 'Left upper molar replacement enquiry.',
      doctorNotes: 'CBCT 3D Scan reviewed. Good bone density for single-stage implant.',
      estimatedCost: 18000,
      paid: false,
      createdAt: new Date().toISOString(),
    }
  ];

  const initialRecords: DentalRecord[] = [
    {
      id: 'rec_01',
      patientId: 'usr_patient_01',
      patientName: 'Rahul Sharma',
      procedure: 'Zirconia Ceramic Crown Placement',
      toothNumbers: ['16'],
      diagnosis: 'Post-endodontic restorative protection on maxillary first molar',
      date: new Date(Date.now() - 604800000).toISOString().split('T')[0],
      doctorName: 'Dr. S. Pal',
      prescriptions: [
        { medicine: 'Amoxicillin 500mg', dosage: '1 tablet thrice daily', duration: '5 days' },
        { medicine: 'Zerodol-SP', dosage: '1 tablet after meals when needed', duration: '3 days' },
        { medicine: 'Chlorhexidine Mouthwash', dosage: '10ml rinse twice daily', duration: '7 days' }
      ],
      cost: 6500,
      notes: 'Fit and occlusion calibrated with articulating paper. Perfect margin seal.'
    },
    {
      id: 'rec_02',
      patientId: 'usr_patient_01',
      patientName: 'Rahul Sharma',
      procedure: 'Deep Ultrasonic Scaling & Stain Removal',
      toothNumbers: ['All Quadrants'],
      diagnosis: 'Mild gingivitis with supragingival calculus buildup',
      date: new Date(Date.now() - 864000000).toISOString().split('T')[0],
      doctorName: 'Dr. S. Pal',
      prescriptions: [
        { medicine: 'Thermoseal Pro Toothpaste', dosage: 'Brush gently twice daily', duration: '30 days' }
      ],
      cost: 1200,
      notes: 'Gums healthy post-scaling. Recommended next review after 6 months.'
    }
  ];

  const initialToothCharts: Record<string, Record<number, ToothCondition>> = {
    usr_patient_01: {
      16: { number: 16, status: 'crown', notes: 'Zirconia Crown placed Oct 2026' },
      15: { number: 15, status: 'treated', notes: 'Composite filling' },
      24: { number: 24, status: 'healthy', notes: 'Checked normal' },
      36: { number: 36, status: 'treated', notes: 'Root canal treated' },
    }
  };

  return {
    users: initialUsers,
    appointments: initialAppointments,
    records: initialRecords,
    toothCharts: initialToothCharts,
    services: initialServices,
  };
}

// Load database helper
function loadDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(dbPath)) {
      const init = getInitialData();
      fs.writeFileSync(dbPath, JSON.stringify(init, null, 2), 'utf-8');
      return init;
    }
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading DB, creating fresh state:', err);
    const init = getInitialData();
    fs.writeFileSync(dbPath, JSON.stringify(init, null, 2), 'utf-8');
    return init;
  }
}

// Save database helper
function saveDB(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

// Auth Middleware
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'patient';
    name: string;
  };
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Token missing.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ error: 'Session expired or invalid token.' });
    }
    req.user = decodedUser as any;
    next();
  });
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Doctor / Administrator privileges required.' });
  }
  next();
}

// ========================
// API ROUTES
// ========================

// 1. Health & Clinic Info
app.get('/api/clinic-info', (req, res) => {
  res.json({
    name: "Dr. Pal's Dental Clinic",
    tagline: "Advanced Dental Care & Complete Smile Restoration",
    doctor: "Dr. S. Pal, BDS, MDS",
    address: "Shop No. 5, Soniya Budhiya Compound, LT Road, opposite Railway Station, near Saikrupa Mall, Tawde Wadi, Dahisar West, Mumbai, Maharashtra 400068",
    phone: "+91 98201 23456",
    alternatePhone: "+91 22 2890 1234",
    email: "contact@drpalsdental.com",
    hours: {
      weekdays: "09:00 AM - 08:30 PM",
      saturday: "09:30 AM - 06:00 PM",
      sunday: "10:00 AM - 02:00 PM (Emergency & Appointments Only)"
    },
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.123456789!2d72.859!3d19.255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDE1JzE4LjAiTiA3MsKwNTEnMzIuNCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  });
});

// 2. Authentication: Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = loadDB();

    const existing = db.users.find((u) => u.email === cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'Account already exists with this email address.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      phone: phone || '',
      role: role === 'admin' ? 'admin' : 'patient',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDB(db);

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = newUser;
    return res.status(201).json({ token, user: safeUser });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
});

// 3. Authentication: Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = loadDB();

    const user = db.users.find((u) => u.email === cleanEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = bcrypt.compareSync(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    return res.json({ token, user: safeUser });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login.' });
  }
});

// 4. Authentication: Current User Profile
app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res) => {
  const db = loadDB();
  const user = db.users.find((u) => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// 5. Update Profile
app.put('/api/auth/profile', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { name, phone, bloodGroup, allergies, medicalNotes, avatar } = req.body;
  const db = loadDB();
  const index = db.users.findIndex((u) => u.id === req.user?.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const updatedUser = {
    ...db.users[index],
    name: name ? name.trim() : db.users[index].name,
    phone: phone !== undefined ? phone : db.users[index].phone,
    bloodGroup: bloodGroup !== undefined ? bloodGroup : db.users[index].bloodGroup,
    allergies: allergies !== undefined ? allergies : db.users[index].allergies,
    medicalNotes: medicalNotes !== undefined ? medicalNotes : db.users[index].medicalNotes,
    avatar: avatar || db.users[index].avatar,
  };

  db.users[index] = updatedUser;
  saveDB(db);

  const { passwordHash: _, ...safeUser } = updatedUser;
  res.json({ user: safeUser });
});

// 6. Appointments: List
app.get('/api/appointments', (req: AuthenticatedRequest, res) => {
  const db = loadDB();
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  let currentUser: any = null;
  if (token) {
    try {
      currentUser = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      // Ignored for guest views
    }
  }

  if (currentUser?.role === 'admin') {
    // Admin sees all appointments sorted newest first
    const sorted = [...db.appointments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return res.json(sorted);
  } else if (currentUser) {
    // Patient sees their own appointments
    const patientApts = db.appointments.filter(
      (a) => a.patientId === currentUser.id || a.patientEmail.toLowerCase() === currentUser.email.toLowerCase()
    );
    return res.json(patientApts);
  } else {
    // Public/Guest: returns empty or basic counts
    return res.json([]);
  }
});

// 7. Appointments: Book New
app.post('/api/appointments', (req: AuthenticatedRequest, res) => {
  try {
    const { patientName, patientEmail, patientPhone, service, date, time, notes } = req.body;

    if (!patientName || !patientEmail || !patientPhone || !service || !date || !time) {
      return res.status(400).json({ error: 'Please provide all required appointment fields.' });
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let userId: string | undefined;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userId = decoded.id;
      } catch (e) {
        // Guest user booking
      }
    }

    const db = loadDB();
    const matchedService = db.services.find((s) => s.title.toLowerCase() === service.toLowerCase());
    const cost = matchedService ? parseInt(matchedService.price.replace(/[^\d]/g, '')) || 2500 : 2500;

    const newAppointment: Appointment = {
      id: `apt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      patientId: userId,
      patientName: patientName.trim(),
      patientEmail: patientEmail.toLowerCase().trim(),
      patientPhone: patientPhone.trim(),
      service,
      date,
      time,
      status: 'pending',
      notes: notes || '',
      doctorNotes: '',
      estimatedCost: cost,
      paid: false,
      createdAt: new Date().toISOString(),
    };

    db.appointments.unshift(newAppointment);
    saveDB(db);

    return res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully! Dr. Pal clinic team will verify and confirm shortly.',
      appointment: newAppointment,
    });
  } catch (err: any) {
    console.error('Booking error:', err);
    return res.status(500).json({ error: 'Failed to create appointment.' });
  }
});

// 8. Appointments: Update Status & Details (Admin/Doctor)
app.patch('/api/appointments/:id', authenticateToken, (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { status, doctorNotes, estimatedCost, paid, time, date } = req.body;
    const db = loadDB();

    const index = db.appointments.findIndex((a) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    const apt = db.appointments[index];

    // Patients can only cancel their own pending/confirmed appointments
    if (req.user?.role !== 'admin') {
      if (apt.patientId !== req.user?.id && apt.patientEmail.toLowerCase() !== req.user?.email.toLowerCase()) {
        return res.status(403).json({ error: 'Not authorized to modify this appointment.' });
      }
      if (status === 'cancelled') {
        apt.status = 'cancelled';
        saveDB(db);
        return res.json({ success: true, appointment: apt });
      }
      return res.status(403).json({ error: 'Patients can only cancel appointments.' });
    }

    // Admin updates
    if (status) apt.status = status;
    if (doctorNotes !== undefined) apt.doctorNotes = doctorNotes;
    if (estimatedCost !== undefined) apt.estimatedCost = estimatedCost;
    if (paid !== undefined) apt.paid = paid;
    if (time) apt.time = time;
    if (date) apt.date = date;

    saveDB(db);
    return res.json({ success: true, appointment: apt });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update appointment.' });
  }
});

// 9. Patients List (Admin only)
app.get('/api/patients', authenticateToken, requireAdmin, (req, res) => {
  const db = loadDB();
  const patientUsers = db.users
    .filter((u) => u.role === 'patient')
    .map(({ passwordHash, ...safe }) => {
      const appointments = db.appointments.filter((a) => a.patientId === safe.id || a.patientEmail === safe.email);
      const records = db.records.filter((r) => r.patientId === safe.id);
      return {
        ...safe,
        appointmentCount: appointments.length,
        lastVisit: appointments.find((a) => a.status === 'completed')?.date || 'New Patient',
        recordsCount: records.length,
      };
    });

  res.json(patientUsers);
});

// 10. Patient Records & Clinical History
app.get('/api/patients/:id/records', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const db = loadDB();

  // Patients can only view their own records
  if (req.user?.role !== 'admin' && req.user?.id !== id) {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const patientRecords = db.records.filter((r) => r.patientId === id);
  res.json(patientRecords);
});

// 11. Add Clinical Record (Admin/Doctor)
app.post('/api/patients/:id/records', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { procedure, toothNumbers, diagnosis, prescriptions, cost, notes, date } = req.body;
    const db = loadDB();

    const patient = db.users.find((u) => u.id === id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    const newRecord: DentalRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      patientId: id,
      patientName: patient.name,
      procedure: procedure || 'Dental Treatment',
      toothNumbers: toothNumbers || [],
      diagnosis: diagnosis || '',
      date: date || new Date().toISOString().split('T')[0],
      doctorName: req.user?.name || 'Dr. S. Pal',
      prescriptions: prescriptions || [],
      cost: cost || 0,
      notes: notes || '',
    };

    db.records.unshift(newRecord);
    saveDB(db);

    res.status(201).json(newRecord);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add clinical record.' });
  }
});

// 12. Tooth Chart
app.get('/api/patients/:id/tooth-chart', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const db = loadDB();

  if (req.user?.role !== 'admin' && req.user?.id !== id) {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const chart = db.toothCharts[id] || {};
  res.json(chart);
});

app.put('/api/patients/:id/tooth-chart', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { toothNumber, status, notes } = req.body;
  const db = loadDB();

  if (!db.toothCharts[id]) {
    db.toothCharts[id] = {};
  }

  db.toothCharts[id][toothNumber] = {
    number: toothNumber,
    status,
    notes,
  };

  saveDB(db);
  res.json(db.toothCharts[id]);
});

// 13. Admin Dashboard Overview Metrics
app.get('/api/stats/overview', authenticateToken, requireAdmin, (req, res) => {
  const db = loadDB();
  const totalPatients = db.users.filter((u) => u.role === 'patient').length;
  const totalAppointments = db.appointments.length;
  const pendingAppointments = db.appointments.filter((a) => a.status === 'pending').length;
  const confirmedAppointments = db.appointments.filter((a) => a.status === 'confirmed').length;
  const completedAppointments = db.appointments.filter((a) => a.status === 'completed').length;

  const totalRevenue = db.appointments
    .filter((a) => a.paid || a.status === 'completed')
    .reduce((sum, a) => sum + (a.estimatedCost || 0), 0);

  // Service distribution
  const serviceCounts: Record<string, number> = {};
  db.appointments.forEach((a) => {
    serviceCounts[a.service] = (serviceCounts[a.service] || 0) + 1;
  });

  res.json({
    totalPatients,
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    totalRevenue,
    serviceCounts,
    recentAppointments: db.appointments.slice(0, 5),
  });
});

// 14. Services Listing
app.get('/api/services', (req, res) => {
  const db = loadDB();
  res.json(db.services);
});

// Vite Middleware mounting in development, or Static Serving in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('⚡ Vite development middlewares attached.');
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 Dr. Pal's Dental Clinic server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failure:', err);
  process.exit(1);
});
