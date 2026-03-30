import { useState, useEffect, useRef } from "react";

// ============================================================
// DATA STORE (In-Memory - Replace with API/DB in production)
// ============================================================
const initialData = {
  employees: [
    { id: "EMP001", name: "أحمد محمد السالم", dept: "تقنية المعلومات", phone: "0501234567", email: "ahmed@company.com", status: "active" },
    { id: "EMP002", name: "فاطمة علي الزهراني", dept: "الموارد البشرية", phone: "0559876543", email: "fatima@company.com", status: "active" },
    { id: "EMP003", name: "خالد عبدالله المطيري", dept: "المالية", phone: "0507654321", email: "khaled@company.com", status: "active" },
    { id: "EMP004", name: "سارة حمد العتيبي", dept: "المشتريات", phone: "0551234567", email: "sara@company.com", status: "active" },
  ],
  vehicles: [
    { id: "VEH001", plate: "أ ب ج 1234", make: "تويوتا", model: "كامري", year: "2021", color: "أبيض", ownerId: "EMP001", km: "45000", status: "active" },
    { id: "VEH002", plate: "د هـ و 5678", make: "هيونداي", model: "سوناتا", year: "2022", color: "فضي", ownerId: "EMP002", km: "32000", status: "active" },
    { id: "VEH003", plate: "ز ح ط 9012", make: "نيسان", model: "التيما", year: "2020", color: "أسود", ownerId: "EMP003", km: "67000", status: "maintenance" },
    { id: "VEH004", plate: "ي ك ل 3456", make: "كيا", model: "سبورتاج", year: "2023", color: "أزرق", ownerId: "EMP004", km: "18000", status: "active" },
  ],
  requests: [
    { id: "REQ001", vehicleId: "VEH001", employeeId: "EMP001", type: "صيانة دورية", description: "تغيير زيت المحرك وفلتر الهواء", priority: "medium", status: "completed", date: "2025-01-10", completedDate: "2025-01-12", technicianNotes: "تم تغيير الزيت والفلاتر" },
    { id: "REQ002", vehicleId: "VEH003", employeeId: "EMP003", type: "إصلاح عطل", description: "صوت غريب في المحرك عند التشغيل", priority: "high", status: "in-progress", date: "2025-01-20", technicianNotes: "يتم الفحص والتشخيص" },
    { id: "REQ003", vehicleId: "VEH002", employeeId: "EMP002", type: "فحص دوري", description: "فحص السيارة قبل رحلة طويلة", priority: "low", status: "pending", date: "2025-01-22", technicianNotes: "" },
    { id: "REQ004", vehicleId: "VEH004", employeeId: "EMP004", type: "تغيير إطارات", description: "تغيير الإطارات الأمامية", priority: "medium", status: "pending", date: "2025-01-23", technicianNotes: "" },
  ],
  parts: [
    { id: "PRT001", name: "زيت محرك 5W-30", category: "زيوت", brand: "Castrol", unit: "لتر", price: 25, stock: 150, minStock: 30, supplier: "شركة الجبر للسيارات", partNo: "OIL-5W30-CAS" },
    { id: "PRT002", name: "فلتر زيت", category: "فلاتر", brand: "Bosch", unit: "قطعة", price: 45, stock: 80, minStock: 20, supplier: "مؤسسة النصر", partNo: "FLT-OIL-BSH" },
    { id: "PRT003", name: "فلتر هواء", category: "فلاتر", brand: "Mann", unit: "قطعة", price: 55, stock: 60, minStock: 15, supplier: "مؤسسة النصر", partNo: "FLT-AIR-MAN" },
    { id: "PRT004", name: "بطارية 70 أمبير", category: "كهرباء", brand: "AC Delco", unit: "قطعة", price: 380, stock: 12, minStock: 5, supplier: "شركة اليامي", partNo: "BAT-70A-ACD" },
    { id: "PRT005", name: "تيل فرامل أمامي", category: "فرامل", brand: "Brembo", unit: "طقم", price: 280, stock: 8, minStock: 5, supplier: "شركة الجبر للسيارات", partNo: "BRK-PAD-BRM" },
    { id: "PRT006", name: "إطار 205/55 R16", category: "إطارات", brand: "Bridgestone", unit: "قطعة", price: 420, stock: 3, minStock: 8, supplier: "معرض الإطارات الحديث", partNo: "TYR-20555-BS" },
    { id: "PRT007", name: "شمعة إشعال", category: "محرك", brand: "NGK", unit: "قطعة", price: 35, stock: 100, minStock: 40, supplier: "مؤسسة النصر", partNo: "SPK-PLG-NGK" },
    { id: "PRT008", name: "سائل تبريد", category: "زيوت", brand: "Prestone", unit: "لتر", price: 30, stock: 45, minStock: 20, supplier: "شركة اليامي", partNo: "CLT-PRE-01" },
  ],
  workOrders: [
    { id: "WO001", requestId: "REQ001", vehicleId: "VEH001", technicianId: "TECH001", technicianName: "محمود أحمد", startDate: "2025-01-11", endDate: "2025-01-12", parts: [{ partId: "PRT001", qty: 4, unitPrice: 25 }, { partId: "PRT002", qty: 1, unitPrice: 45 }], laborCost: 150, status: "closed", notes: "تم التنفيذ بنجاح" },
    { id: "WO002", requestId: "REQ002", vehicleId: "VEH003", technicianId: "TECH002", technicianName: "علي حسن", startDate: "2025-01-21", endDate: null, parts: [], laborCost: 0, status: "open", notes: "جاري الفحص" },
  ],
  suppliers: [
    { id: "SUP001", name: "شركة الجبر للسيارات", contact: "0112345678", email: "jabr@auto.com", address: "الرياض - حي الصناعية", category: "قطع غيار عامة", rating: 5 },
    { id: "SUP002", name: "مؤسسة النصر", contact: "0113456789", email: "nasr@parts.com", address: "الرياض - طريق الملك فهد", category: "فلاتر وزيوت", rating: 4 },
    { id: "SUP003", name: "شركة اليامي", contact: "0114567890", email: "yami@auto.com", address: "جدة - الكورنيش", category: "كهرباء وبطاريات", rating: 4 },
    { id: "SUP004", name: "معرض الإطارات الحديث", contact: "0115678901", email: "tires@modern.com", address: "الرياض - الدائري الشرقي", category: "إطارات", rating: 3 },
  ],
  technicians: [
    { id: "TECH001", name: "محمود أحمد", specialty: "محرك وناقل حركة", phone: "0561234567", status: "available" },
    { id: "TECH002", name: "علي حسن", specialty: "كهرباء وإلكترونيات", phone: "0562345678", status: "busy" },
    { id: "TECH003", name: "سعد النمر", specialty: "هيكل وتكييف", phone: "0563456789", status: "available" },
  ],
};

// ============================================================
// UTILITIES
// ============================================================
const STATUS_MAP = {
  pending: { label: "قيد الانتظار", color: "#F59E0B", bg: "#FEF3C7" },
  "in-progress": { label: "جاري التنفيذ", color: "#3B82F6", bg: "#EFF6FF" },
  completed: { label: "مكتمل", color: "#10B981", bg: "#ECFDF5" },
  cancelled: { label: "ملغي", color: "#EF4444", bg: "#FEF2F2" },
  active: { label: "نشط", color: "#10B981", bg: "#ECFDF5" },
  maintenance: { label: "في الصيانة", color: "#F59E0B", bg: "#FEF3C7" },
  open: { label: "مفتوح", color: "#3B82F6", bg: "#EFF6FF" },
  closed: { label: "مغلق", color: "#10B981", bg: "#ECFDF5" },
  available: { label: "متاح", color: "#10B981", bg: "#ECFDF5" },
  busy: { label: "مشغول", color: "#F59E0B", bg: "#FEF3C7" },
};

const PRIORITY_MAP = {
  low: { label: "منخفضة", color: "#6B7280" },
  medium: { label: "متوسطة", color: "#F59E0B" },
  high: { label: "عالية", color: "#EF4444" },
  critical: { label: "حرجة", color: "#7C3AED" },
};

const generateId = (prefix) => `${prefix}${Date.now().toString().slice(-6)}`;
const formatDate = (d) => d ? new Date(d).toLocaleDateString("ar-SA") : "-";
const formatCurrency = (n) => `${Number(n).toLocaleString("ar-SA")} ر.س`;

// ============================================================
// MAIN APP
// ============================================================
export default function GarageApp() {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState("admin"); // admin | employee | garage
  const [currentUser, setCurrentUser] = useState({ id: "EMP001", name: "أحمد محمد السالم", role: "admin" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateData = (key, items) => setData(prev => ({ ...prev, [key]: items }));

  const tabs = [
    { id: "dashboard", label: "لوحة التحكم", icon: "⊞" },
    { id: "requests", label: "طلبات الصيانة", icon: "🔧" },
    { id: "vehicles", label: "السيارات", icon: "🚗" },
    { id: "workorders", label: "أوامر العمل", icon: "📋" },
    { id: "parts", label: "قطع الغيار", icon: "⚙️" },
    { id: "employees", label: "الموظفون", icon: "👤" },
    { id: "suppliers", label: "الموردون", icon: "🏭" },
    { id: "technicians", label: "الفنيون", icon: "👨‍🔧" },
    { id: "reports", label: "التقارير", icon: "📊" },
  ];

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif", background: "#0F1117", minHeight: "100vh", color: "#E2E8F0", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #1A1D27; }
        ::-webkit-scrollbar-thumb { background: #FF6B2B; border-radius: 10px; }
        input, select, textarea { font-family: 'Cairo', sans-serif !important; }
        .nav-item { transition: all 0.2s; cursor: pointer; border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; color: #94A3B8; font-size: 14px; font-weight: 500; }
        .nav-item:hover { background: rgba(255,107,43,0.1); color: #FF6B2B; }
        .nav-item.active { background: linear-gradient(135deg, rgba(255,107,43,0.25), rgba(255,107,43,0.1)); color: #FF6B2B; border: 1px solid rgba(255,107,43,0.3); }
        .card { background: #1A1D27; border: 1px solid #2D3148; border-radius: 14px; }
        .btn { cursor: pointer; border: none; border-radius: 8px; font-family: 'Cairo', sans-serif; font-weight: 600; font-size: 13px; padding: 9px 18px; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; }
        .btn-primary { background: linear-gradient(135deg, #FF6B2B, #FF8C42); color: white; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(255,107,43,0.4); }
        .btn-secondary { background: #2D3148; color: #94A3B8; }
        .btn-secondary:hover { background: #363B5C; color: #E2E8F0; }
        .btn-danger { background: rgba(239,68,68,0.15); color: #EF4444; border: 1px solid rgba(239,68,68,0.3); }
        .btn-danger:hover { background: rgba(239,68,68,0.25); }
        .btn-success { background: rgba(16,185,129,0.15); color: #10B981; border: 1px solid rgba(16,185,129,0.3); }
        .btn-success:hover { background: rgba(16,185,129,0.25); }
        .input { background: #0F1117; border: 1px solid #2D3148; border-radius: 8px; color: #E2E8F0; padding: 9px 12px; font-size: 13px; width: 100%; outline: none; transition: border-color 0.2s; }
        .input:focus { border-color: #FF6B2B; }
        .label { font-size: 12px; color: #64748B; margin-bottom: 5px; font-weight: 600; }
        .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .table-row { border-bottom: 1px solid #1E2235; transition: background 0.15s; }
        .table-row:hover { background: rgba(255,107,43,0.04); }
        .stat-card { background: #1A1D27; border: 1px solid #2D3148; border-radius: 14px; padding: 20px; position: relative; overflow: hidden; }
        .stat-card::before { content: ''; position: absolute; top: 0; right: 0; width: 4px; height: 100%; border-radius: 14px 0 0 14px; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
        .modal { background: #1A1D27; border: 1px solid #2D3148; border-radius: 18px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
        .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); padding: 12px 24px; border-radius: 30px; font-size: 14px; font-weight: 600; z-index: 9999; animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { transform: translateX(-50%) translateY(20px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
        .low-stock { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        select option { background: #1A1D27; color: #E2E8F0; }
      `}</style>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <div style={{ width: 240, background: "#13151F", borderLeft: "1px solid #2D3148", padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
          {/* Logo */}
          <div style={{ padding: "10px 8px 20px", borderBottom: "1px solid #2D3148", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #FF6B2B, #FF8C42)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔧</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#FF6B2B" }}>نظام الكراج</div>
                <div style={{ fontSize: 10, color: "#64748B" }}>إدارة صيانة المركبات</div>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div style={{ padding: "10px 8px", background: "rgba(255,107,43,0.05)", borderRadius: 10, marginBottom: 12, border: "1px solid rgba(255,107,43,0.15)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{currentUser.name}</div>
            <div style={{ fontSize: 11, color: "#FF6B2B" }}>مدير النظام</div>
          </div>

          {tabs.map(t => (
            <div key={t.id} className={`nav-item ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <span>{t.label}</span>
              {t.id === "parts" && data.parts.filter(p => p.stock <= p.minStock).length > 0 && (
                <span style={{ marginRight: "auto", background: "#EF4444", color: "white", borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>
                  {data.parts.filter(p => p.stock <= p.minStock).length}
                </span>
              )}
              {t.id === "requests" && data.requests.filter(r => r.status === "pending").length > 0 && (
                <span style={{ marginRight: "auto", background: "#F59E0B", color: "white", borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>
                  {data.requests.filter(r => r.status === "pending").length}
                </span>
              )}
            </div>
          ))}

          <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #2D3148" }}>
            <div style={{ fontSize: 11, color: "#475569", textAlign: "center" }}>نسخة 2.0.0 | 2025</div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflowX: "hidden" }}>
        {/* TOP BAR */}
        <div style={{ background: "#13151F", borderBottom: "1px solid #2D3148", padding: "12px 24px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
          <button className="btn btn-secondary" style={{ padding: "6px 10px" }} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1 style={{ fontSize: 18, fontWeight: 800, flex: 1, color: "#E2E8F0" }}>
            {tabs.find(t => t.id === activeTab)?.icon} {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <div style={{ fontSize: 12, color: "#64748B" }}>{new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: 24 }}>
          {activeTab === "dashboard" && <Dashboard data={data} setActiveTab={setActiveTab} />}
          {activeTab === "requests" && <RequestsTab data={data} updateData={updateData} showToast={showToast} setModal={setModal} />}
          {activeTab === "vehicles" && <VehiclesTab data={data} updateData={updateData} showToast={showToast} />}
          {activeTab === "workorders" && <WorkOrdersTab data={data} updateData={updateData} showToast={showToast} />}
          {activeTab === "parts" && <PartsTab data={data} updateData={updateData} showToast={showToast} />}
          {activeTab === "employees" && <EmployeesTab data={data} updateData={updateData} showToast={showToast} />}
          {activeTab === "suppliers" && <SuppliersTab data={data} updateData={updateData} showToast={showToast} />}
          {activeTab === "technicians" && <TechniciansTab data={data} updateData={updateData} showToast={showToast} />}
          {activeTab === "reports" && <ReportsTab data={data} />}
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="toast" style={{ background: toast.type === "success" ? "#10B981" : toast.type === "error" ? "#EF4444" : "#F59E0B", color: "white" }}>
          {toast.type === "success" ? "✓ " : "✗ "}{toast.msg}
        </div>
      )}
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ data, setActiveTab }) {
  const totalRequests = data.requests.length;
  const pendingRequests = data.requests.filter(r => r.status === "pending").length;
  const inProgressRequests = data.requests.filter(r => r.status === "in-progress").length;
  const completedRequests = data.requests.filter(r => r.status === "completed").length;
  const lowStockParts = data.parts.filter(p => p.stock <= p.minStock).length;
  const vehiclesInMaintenance = data.vehicles.filter(v => v.status === "maintenance").length;
  const totalCost = data.workOrders.reduce((sum, wo) => {
    const partsCost = wo.parts.reduce((s, p) => s + p.qty * p.unitPrice, 0);
    return sum + partsCost + wo.laborCost;
  }, 0);

  const stats = [
    { label: "إجمالي الطلبات", value: totalRequests, sub: `${pendingRequests} قيد الانتظار`, color: "#3B82F6", icon: "📋" },
    { label: "جاري التنفيذ", value: inProgressRequests, sub: `${completedRequests} مكتمل`, color: "#FF6B2B", icon: "🔧" },
    { label: "سيارات في الصيانة", value: vehiclesInMaintenance, sub: `من ${data.vehicles.length} سيارة`, color: "#F59E0B", icon: "🚗" },
    { label: "تنبيهات المخزون", value: lowStockParts, sub: "قطعة تحتاج توريد", color: "#EF4444", icon: "⚠️" },
    { label: "إجمالي تكاليف الصيانة", value: formatCurrency(totalCost), sub: "تكلفة فعلية", color: "#10B981", icon: "💰", wide: true },
  ];

  const recentRequests = [...data.requests].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ "--c": s.color }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 4, height: "100%", background: s.color, borderRadius: "14px 0 0 14px" }} />
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: s.wide ? 18 : 32, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent Requests */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#E2E8F0" }}>أحدث طلبات الصيانة</h3>
            <button className="btn btn-secondary" style={{ fontSize: 11, padding: "5px 10px" }} onClick={() => setActiveTab("requests")}>عرض الكل</button>
          </div>
          {recentRequests.map(req => {
            const vehicle = data.vehicles.find(v => v.id === req.vehicleId);
            const employee = data.employees.find(e => e.id === req.employeeId);
            const st = STATUS_MAP[req.status];
            const pr = PRIORITY_MAP[req.priority];
            return (
              <div key={req.id} className="table-row" style={{ padding: "10px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{req.type}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{employee?.name} • {vehicle?.make} {vehicle?.model}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span className="badge" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                  <span style={{ fontSize: 10, color: pr.color, fontWeight: 700 }}>{pr.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Low Stock Parts */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#E2E8F0" }}>تنبيهات المخزون</h3>
            <button className="btn btn-secondary" style={{ fontSize: 11, padding: "5px 10px" }} onClick={() => setActiveTab("parts")}>عرض الكل</button>
          </div>
          {data.parts.filter(p => p.stock <= p.minStock).length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "#64748B" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <div>المخزون كافٍ</div>
            </div>
          ) : (
            data.parts.filter(p => p.stock <= p.minStock).map(part => (
              <div key={part.id} className="table-row low-stock" style={{ padding: "10px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{part.name}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{part.brand} • {part.supplier}</div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: part.stock === 0 ? "#EF4444" : "#F59E0B" }}>{part.stock} {part.unit}</div>
                  <div style={{ fontSize: 10, color: "#64748B" }}>الحد الأدنى: {part.minStock}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Vehicles Status */}
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>حالة المركبات</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
          {data.vehicles.map(v => {
            const owner = data.employees.find(e => e.id === v.ownerId);
            const st = STATUS_MAP[v.status];
            return (
              <div key={v.id} style={{ background: "#0F1117", borderRadius: 10, padding: 14, border: `1px solid ${v.status === "maintenance" ? "rgba(245,158,11,0.3)" : "#2D3148"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>🚗</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{v.make} {v.model} {v.year}</div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>لوحة: {v.plate}</div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>المالك: {owner?.name}</div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>العداد: {Number(v.km).toLocaleString("ar-SA")} كم</div>
                  </div>
                  <span className="badge" style={{ background: st.bg, color: st.color, fontSize: 10 }}>{st.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// REQUESTS TAB
// ============================================================
function RequestsTab({ data, updateData, showToast }) {
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editReq, setEditReq] = useState(null);
  const [viewReq, setViewReq] = useState(null);
  const [form, setForm] = useState({ vehicleId: "", employeeId: "", type: "", description: "", priority: "medium" });

  const filtered = filter === "all" ? data.requests : data.requests.filter(r => r.status === filter);

  const handleSubmit = () => {
    if (!form.vehicleId || !form.type || !form.description) return showToast("يرجى تعبئة جميع الحقول", "error");
    const vehicle = data.vehicles.find(v => v.id === form.vehicleId);
    const newReq = {
      id: generateId("REQ"),
      ...form,
      employeeId: vehicle?.ownerId || "",
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      completedDate: null,
      technicianNotes: "",
    };
    updateData("requests", [...data.requests, newReq]);
    // Update vehicle status
    updateData("vehicles", data.vehicles.map(v => v.id === form.vehicleId ? { ...v, status: "maintenance" } : v));
    setShowForm(false);
    setForm({ vehicleId: "", employeeId: "", type: "", description: "", priority: "medium" });
    showToast("تم إضافة طلب الصيانة بنجاح");
  };

  const updateStatus = (id, newStatus) => {
    updateData("requests", data.requests.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, status: newStatus };
      if (newStatus === "completed") {
        updated.completedDate = new Date().toISOString().split("T")[0];
        // Update vehicle status
        updateData("vehicles", data.vehicles.map(v => v.id === r.vehicleId ? { ...v, status: "active" } : v));
      }
      return updated;
    }));
    showToast("تم تحديث حالة الطلب");
  };

  const deleteReq = (id) => {
    updateData("requests", data.requests.filter(r => r.id !== id));
    showToast("تم حذف الطلب");
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ طلب صيانة جديد</button>
        {["all", "pending", "in-progress", "completed", "cancelled"].map(s => (
          <button key={s} className={`btn ${filter === s ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: 12 }} onClick={() => setFilter(s)}>
            {s === "all" ? "الكل" : STATUS_MAP[s]?.label}
            <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "1px 7px", fontSize: 10 }}>
              {s === "all" ? data.requests.length : data.requests.filter(r => r.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#13151F" }}>
                {["رقم الطلب", "السيارة", "الموظف", "نوع الصيانة", "الأولوية", "التاريخ", "الحالة", "الإجراءات"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", fontSize: 12, color: "#64748B", fontWeight: 700, textAlign: "right", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => {
                const vehicle = data.vehicles.find(v => v.id === req.vehicleId);
                const employee = data.employees.find(e => e.id === req.employeeId);
                const st = STATUS_MAP[req.status];
                const pr = PRIORITY_MAP[req.priority];
                return (
                  <tr key={req.id} className="table-row">
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#FF6B2B", fontWeight: 700 }}>{req.id}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13 }}>{vehicle ? `${vehicle.make} ${vehicle.model}` : "-"}<div style={{ fontSize: 11, color: "#64748B" }}>{vehicle?.plate}</div></td>
                    <td style={{ padding: "12px 14px", fontSize: 13 }}>{employee?.name || "-"}<div style={{ fontSize: 11, color: "#64748B" }}>{employee?.dept}</div></td>
                    <td style={{ padding: "12px 14px", fontSize: 13 }}>{req.type}</td>
                    <td style={{ padding: "12px 14px" }}><span style={{ color: pr.color, fontWeight: 700, fontSize: 12 }}>● {pr.label}</span></td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "#94A3B8" }}>{formatDate(req.date)}</td>
                    <td style={{ padding: "12px 14px" }}><span className="badge" style={{ background: st.bg, color: st.color }}>{st.label}</span></td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-secondary" style={{ fontSize: 11, padding: "4px 8px" }} onClick={() => setViewReq(req)}>عرض</button>
                        {req.status === "pending" && <button className="btn btn-success" style={{ fontSize: 11, padding: "4px 8px" }} onClick={() => updateStatus(req.id, "in-progress")}>بدء</button>}
                        {req.status === "in-progress" && <button className="btn btn-success" style={{ fontSize: 11, padding: "4px 8px" }} onClick={() => updateStatus(req.id, "completed")}>إتمام</button>}
                        {req.status === "pending" && <button className="btn btn-danger" style={{ fontSize: 11, padding: "4px 8px" }} onClick={() => deleteReq(req.id)}>حذف</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 40, color: "#64748B" }}>لا توجد طلبات</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, color: "#FF6B2B" }}>🔧 طلب صيانة جديد</h2>
            <FormField label="اختر السيارة *">
              <select className="input" value={form.vehicleId} onChange={e => setForm({ ...form, vehicleId: e.target.value })}>
                <option value="">-- اختر سيارة --</option>
                {data.vehicles.map(v => {
                  const owner = data.employees.find(emp => emp.id === v.ownerId);
                  return <option key={v.id} value={v.id}>{v.make} {v.model} - {v.plate} ({owner?.name})</option>;
                })}
              </select>
            </FormField>
            <FormField label="نوع الصيانة *">
              <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="">-- اختر النوع --</option>
                {["صيانة دورية", "إصلاح عطل", "فحص دوري", "تغيير إطارات", "كهرباء", "تكييف", "هيكل وطلاء", "أخرى"].map(t => <option key={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="الأولوية">
              <select className="input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
                <option value="critical">حرجة</option>
              </select>
            </FormField>
            <FormField label="وصف المشكلة *">
              <textarea className="input" rows={3} style={{ resize: "vertical" }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="اكتب وصفاً تفصيلياً للمشكلة..." />
            </FormField>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" onClick={handleSubmit}>إرسال الطلب</button>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* View Request Modal */}
      {viewReq && (
        <div className="modal-overlay" onClick={() => setViewReq(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: "#FF6B2B" }}>📋 تفاصيل الطلب {viewReq.id}</h2>
            <span className="badge" style={{ background: STATUS_MAP[viewReq.status]?.bg, color: STATUS_MAP[viewReq.status]?.color, marginBottom: 20, display: "inline-block" }}>{STATUS_MAP[viewReq.status]?.label}</span>
            {[
              ["السيارة", data.vehicles.find(v => v.id === viewReq.vehicleId)?.make + " " + data.vehicles.find(v => v.id === viewReq.vehicleId)?.model],
              ["رقم اللوحة", data.vehicles.find(v => v.id === viewReq.vehicleId)?.plate],
              ["الموظف", data.employees.find(e => e.id === viewReq.employeeId)?.name],
              ["نوع الصيانة", viewReq.type],
              ["الأولوية", PRIORITY_MAP[viewReq.priority]?.label],
              ["تاريخ الطلب", formatDate(viewReq.date)],
              ["تاريخ الإتمام", viewReq.completedDate ? formatDate(viewReq.completedDate) : "-"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #2D3148" }}>
                <span style={{ color: "#64748B", fontSize: 13, minWidth: 130 }}>{k}:</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 14 }}>
              <div className="label">وصف المشكلة</div>
              <div style={{ background: "#0F1117", padding: 12, borderRadius: 8, fontSize: 13, color: "#94A3B8" }}>{viewReq.description}</div>
            </div>
            {viewReq.technicianNotes && (
              <div style={{ marginTop: 14 }}>
                <div className="label">ملاحظات الفني</div>
                <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", padding: 12, borderRadius: 8, fontSize: 13, color: "#10B981" }}>{viewReq.technicianNotes}</div>
              </div>
            )}
            <button className="btn btn-secondary" style={{ marginTop: 20 }} onClick={() => setViewReq(null)}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// VEHICLES TAB
// ============================================================
function VehiclesTab({ data, updateData, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ plate: "", make: "", model: "", year: "", color: "", ownerId: "", km: "" });

  const handleAdd = () => {
    if (!form.plate || !form.make || !form.ownerId) return showToast("يرجى تعبئة الحقول الإلزامية", "error");
    const newV = { id: generateId("VEH"), ...form, status: "active" };
    updateData("vehicles", [...data.vehicles, newV]);
    setShowForm(false);
    setForm({ plate: "", make: "", model: "", year: "", color: "", ownerId: "", km: "" });
    showToast("تم إضافة السيارة بنجاح");
  };

  const deleteVehicle = (id) => {
    updateData("vehicles", data.vehicles.filter(v => v.id !== id));
    showToast("تم حذف السيارة");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12 }}>
          {["all", "active", "maintenance"].map(s => {
            const cnt = s === "all" ? data.vehicles.length : data.vehicles.filter(v => v.status === s).length;
            return (
              <div key={s} style={{ background: "#1A1D27", border: "1px solid #2D3148", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: "#94A3B8" }}>
                {s === "all" ? "الكل" : STATUS_MAP[s]?.label}: <strong style={{ color: "#FF6B2B" }}>{cnt}</strong>
              </div>
            );
          })}
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ إضافة سيارة</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {data.vehicles.map(v => {
          const owner = data.employees.find(e => e.id === v.ownerId);
          const st = STATUS_MAP[v.status];
          const vehicleRequests = data.requests.filter(r => r.vehicleId === v.id);
          return (
            <div key={v.id} className="card" style={{ padding: 20, borderColor: v.status === "maintenance" ? "rgba(245,158,11,0.3)" : "#2D3148" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ fontSize: 36 }}>🚗</div>
                <span className="badge" style={{ background: st.bg, color: st.color }}>{st.label}</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>{v.make} {v.model}</div>
              <div style={{ fontSize: 13, color: "#FF6B2B", fontWeight: 700, marginBottom: 12 }}>{v.plate}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[["السنة", v.year], ["اللون", v.color], ["المالك", owner?.name], ["القسم", owner?.dept], ["العداد", `${Number(v.km).toLocaleString()} كم`], ["طلبات الصيانة", `${vehicleRequests.length} طلب`]].map(([k, val]) => (
                  <div key={k} style={{ background: "#0F1117", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, color: "#64748B" }}>{k}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button className="btn btn-danger" style={{ fontSize: 11, padding: "5px 10px" }} onClick={() => deleteVehicle(v.id)}>حذف</button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, color: "#FF6B2B" }}>🚗 إضافة سيارة جديدة</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormField label="رقم اللوحة *"><input className="input" value={form.plate} onChange={e => setForm({ ...form, plate: e.target.value })} placeholder="أ ب ج 1234" /></FormField>
              <FormField label="الشركة المصنعة *"><input className="input" value={form.make} onChange={e => setForm({ ...form, make: e.target.value })} placeholder="تويوتا" /></FormField>
              <FormField label="الموديل"><input className="input" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} placeholder="كامري" /></FormField>
              <FormField label="سنة الصنع"><input className="input" type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2023" /></FormField>
              <FormField label="اللون"><input className="input" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} placeholder="أبيض" /></FormField>
              <FormField label="قراءة العداد (كم)"><input className="input" type="number" value={form.km} onChange={e => setForm({ ...form, km: e.target.value })} placeholder="0" /></FormField>
            </div>
            <FormField label="المالك (الموظف) *">
              <select className="input" value={form.ownerId} onChange={e => setForm({ ...form, ownerId: e.target.value })}>
                <option value="">-- اختر الموظف --</option>
                {data.employees.map(e => <option key={e.id} value={e.id}>{e.name} - {e.dept}</option>)}
              </select>
            </FormField>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" onClick={handleAdd}>حفظ</button>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// WORK ORDERS TAB
// ============================================================
function WorkOrdersTab({ data, updateData, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedParts, setSelectedParts] = useState([]);
  const [form, setForm] = useState({ requestId: "", technicianId: "", laborCost: "", notes: "" });

  const handleAdd = () => {
    if (!form.requestId || !form.technicianId) return showToast("يرجى تعبئة الحقول الإلزامية", "error");
    const req = data.requests.find(r => r.id === form.requestId);
    const tech = data.technicians.find(t => t.id === form.technicianId);
    const newWO = {
      id: generateId("WO"),
      requestId: form.requestId,
      vehicleId: req?.vehicleId,
      technicianId: form.technicianId,
      technicianName: tech?.name,
      startDate: new Date().toISOString().split("T")[0],
      endDate: null,
      parts: selectedParts,
      laborCost: Number(form.laborCost) || 0,
      status: "open",
      notes: form.notes,
    };
    // Deduct stock
    const updatedParts = data.parts.map(p => {
      const used = selectedParts.find(sp => sp.partId === p.id);
      return used ? { ...p, stock: p.stock - used.qty } : p;
    });
    updateData("parts", updatedParts);
    updateData("workOrders", [...data.workOrders, newWO]);
    updateData("requests", data.requests.map(r => r.id === form.requestId ? { ...r, status: "in-progress" } : r));
    updateData("technicians", data.technicians.map(t => t.id === form.technicianId ? { ...t, status: "busy" } : t));
    setShowForm(false);
    setSelectedParts([]);
    setForm({ requestId: "", technicianId: "", laborCost: "", notes: "" });
    showToast("تم إنشاء أمر العمل بنجاح");
  };

  const closeWO = (id) => {
    updateData("workOrders", data.workOrders.map(wo => wo.id === id ? { ...wo, status: "closed", endDate: new Date().toISOString().split("T")[0] } : wo));
    const wo = data.workOrders.find(w => w.id === id);
    if (wo) {
      updateData("requests", data.requests.map(r => r.id === wo.requestId ? { ...r, status: "completed", completedDate: new Date().toISOString().split("T")[0] } : r));
      updateData("vehicles", data.vehicles.map(v => v.id === wo.vehicleId ? { ...v, status: "active" } : v));
      updateData("technicians", data.technicians.map(t => t.id === wo.technicianId ? { ...t, status: "available" } : t));
    }
    showToast("تم إغلاق أمر العمل");
  };

  const addPart = () => setSelectedParts([...selectedParts, { partId: "", qty: 1, unitPrice: 0 }]);

  const updatePart = (idx, field, value) => {
    const updated = [...selectedParts];
    updated[idx] = { ...updated[idx], [field]: value };
    if (field === "partId") {
      const part = data.parts.find(p => p.id === value);
      if (part) updated[idx].unitPrice = part.price;
    }
    setSelectedParts(updated);
  };

  const totalCost = (wo) => wo.parts.reduce((s, p) => s + p.qty * p.unitPrice, 0) + wo.laborCost;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, color: "#94A3B8" }}>إجمالي أوامر العمل: <strong style={{ color: "#FF6B2B" }}>{data.workOrders.length}</strong></h3>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ إنشاء أمر عمل</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {data.workOrders.map(wo => {
          const req = data.requests.find(r => r.id === wo.requestId);
          const vehicle = data.vehicles.find(v => v.id === wo.vehicleId);
          const st = STATUS_MAP[wo.status];
          return (
            <div key={wo.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <span style={{ fontSize: 11, color: "#FF6B2B", fontWeight: 700 }}>{wo.id}</span>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>{req?.type || "أمر عمل"}</h3>
                  <div style={{ fontSize: 12, color: "#64748B" }}>{vehicle?.make} {vehicle?.model} • {vehicle?.plate}</div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <span className="badge" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#FF6B2B", marginTop: 8 }}>{formatCurrency(totalCost(wo))}</div>
                  <div style={{ fontSize: 10, color: "#64748B" }}>إجمالي التكلفة</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
                {[["الفني", wo.technicianName], ["تاريخ البدء", formatDate(wo.startDate)], ["تاريخ الإغلاق", wo.endDate ? formatDate(wo.endDate) : "-"], ["أجر العمل", formatCurrency(wo.laborCost)]].map(([k, v]) => (
                  <div key={k} style={{ background: "#0F1117", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, color: "#64748B" }}>{k}</div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{v}</div>
                  </div>
                ))}
              </div>
              {wo.parts.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div className="label">القطع المستخدمة</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {wo.parts.map((p, i) => {
                      const part = data.parts.find(pt => pt.id === p.partId);
                      return (
                        <span key={i} style={{ background: "#0F1117", border: "1px solid #2D3148", borderRadius: 6, padding: "5px 10px", fontSize: 11 }}>
                          {part?.name} × {p.qty} = {formatCurrency(p.qty * p.unitPrice)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {wo.notes && <div style={{ fontSize: 12, color: "#64748B", fontStyle: "italic" }}>ملاحظات: {wo.notes}</div>}
              {wo.status === "open" && (
                <button className="btn btn-success" style={{ marginTop: 12 }} onClick={() => closeWO(wo.id)}>✓ إغلاق أمر العمل</button>
              )}
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, color: "#FF6B2B" }}>📋 إنشاء أمر عمل</h2>
            <FormField label="طلب الصيانة المرتبط *">
              <select className="input" value={form.requestId} onChange={e => setForm({ ...form, requestId: e.target.value })}>
                <option value="">-- اختر الطلب --</option>
                {data.requests.filter(r => r.status === "pending").map(r => {
                  const v = data.vehicles.find(v => v.id === r.vehicleId);
                  return <option key={r.id} value={r.id}>{r.id} - {r.type} ({v?.make} {v?.model})</option>;
                })}
              </select>
            </FormField>
            <FormField label="الفني المسؤول *">
              <select className="input" value={form.technicianId} onChange={e => setForm({ ...form, technicianId: e.target.value })}>
                <option value="">-- اختر الفني --</option>
                {data.technicians.filter(t => t.status === "available").map(t => <option key={t.id} value={t.id}>{t.name} - {t.specialty}</option>)}
              </select>
            </FormField>
            <FormField label="أجر العمل (ر.س)">
              <input className="input" type="number" value={form.laborCost} onChange={e => setForm({ ...form, laborCost: e.target.value })} placeholder="0" />
            </FormField>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div className="label" style={{ marginBottom: 0 }}>القطع المستخدمة</div>
                <button className="btn btn-secondary" style={{ fontSize: 11, padding: "4px 10px" }} onClick={addPart}>+ إضافة قطعة</button>
              </div>
              {selectedParts.map((sp, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, marginBottom: 8 }}>
                  <select className="input" value={sp.partId} onChange={e => updatePart(i, "partId", e.target.value)}>
                    <option value="">-- اختر القطعة --</option>
                    {data.parts.filter(p => p.stock > 0).map(p => <option key={p.id} value={p.id}>{p.name} (متاح: {p.stock})</option>)}
                  </select>
                  <input className="input" type="number" style={{ width: 70 }} value={sp.qty} min={1} onChange={e => updatePart(i, "qty", Number(e.target.value))} placeholder="كمية" />
                  <button className="btn btn-danger" style={{ padding: "4px 8px" }} onClick={() => setSelectedParts(selectedParts.filter((_, j) => j !== i))}>✕</button>
                </div>
              ))}
            </div>
            <FormField label="ملاحظات">
              <textarea className="input" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </FormField>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" onClick={handleAdd}>إنشاء</button>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PARTS TAB
// ============================================================
function PartsTab({ data, updateData, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", category: "", brand: "", unit: "قطعة", price: "", stock: "", minStock: "", supplier: "", partNo: "" });

  const filtered = data.parts.filter(p =>
    p.name.includes(search) || p.brand.includes(search) || p.category.includes(search) || p.partNo.includes(search)
  );

  const handleAdd = () => {
    if (!form.name || !form.price) return showToast("يرجى تعبئة الحقول الإلزامية", "error");
    updateData("parts", [...data.parts, { id: generateId("PRT"), ...form, price: Number(form.price), stock: Number(form.stock), minStock: Number(form.minStock) }]);
    setShowForm(false);
    setForm({ name: "", category: "", brand: "", unit: "قطعة", price: "", stock: "", minStock: "", supplier: "", partNo: "" });
    showToast("تم إضافة القطعة بنجاح");
  };

  const updateStock = (id, delta) => {
    updateData("parts", data.parts.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
  };

  const categories = [...new Set(data.parts.map(p => p.category))];

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input className="input" style={{ maxWidth: 300 }} placeholder="بحث عن قطعة..." value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ إضافة قطعة</button>
        <div style={{ marginRight: "auto", display: "flex", gap: 10 }}>
          <div style={{ background: "#1A1D27", border: "1px solid #2D3148", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
            مخزون منخفض: <strong style={{ color: "#EF4444" }}>{data.parts.filter(p => p.stock <= p.minStock).length}</strong>
          </div>
          <div style={{ background: "#1A1D27", border: "1px solid #2D3148", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
            إجمالي القطع: <strong style={{ color: "#FF6B2B" }}>{data.parts.length}</strong>
          </div>
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#13151F" }}>
                {["رقم القطعة", "اسم القطعة", "التصنيف", "الماركة", "المورد", "السعر", "المخزون", "الحد الأدنى", "الحالة", "تعديل المخزون"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", fontSize: 12, color: "#64748B", fontWeight: 700, textAlign: "right", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(part => {
                const isLow = part.stock <= part.minStock;
                return (
                  <tr key={part.id} className="table-row" style={isLow ? { background: "rgba(239,68,68,0.04)" } : {}}>
                    <td style={{ padding: "10px 14px", fontSize: 11, color: "#64748B", fontFamily: "monospace" }}>{part.partNo}</td>
                    <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600 }}>{part.name}</td>
                    <td style={{ padding: "10px 14px" }}><span style={{ background: "#0F1117", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#94A3B8" }}>{part.category}</span></td>
                    <td style={{ padding: "10px 14px", fontSize: 12 }}>{part.brand}</td>
                    <td style={{ padding: "10px 14px", fontSize: 11, color: "#64748B" }}>{part.supplier}</td>
                    <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "#10B981" }}>{formatCurrency(part.price)}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: isLow ? "#EF4444" : "#E2E8F0" }} className={isLow ? "low-stock" : ""}>{part.stock}</span>
                      <span style={{ fontSize: 11, color: "#64748B", marginRight: 4 }}>{part.unit}</span>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "#64748B" }}>{part.minStock} {part.unit}</td>
                    <td style={{ padding: "10px 14px" }}>
                      {isLow
                        ? <span className="badge" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>مخزون منخفض</span>
                        : <span className="badge" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>كافٍ</span>
                      }
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <button className="btn" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981", padding: "3px 10px", fontSize: 16 }} onClick={() => updateStock(part.id, 10)}>+</button>
                        <button className="btn" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444", padding: "3px 10px", fontSize: 16 }} onClick={() => updateStock(part.id, -1)}>−</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, color: "#FF6B2B" }}>⚙️ إضافة قطعة غيار</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormField label="اسم القطعة *"><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></FormField>
              <FormField label="رقم القطعة"><input className="input" value={form.partNo} onChange={e => setForm({ ...form, partNo: e.target.value })} /></FormField>
              <FormField label="التصنيف">
                <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">-- اختر --</option>
                  {["زيوت", "فلاتر", "فرامل", "كهرباء", "إطارات", "محرك", "هيكل", "تكييف", "أخرى"].map(c => <option key={c}>{c}</option>)}
                </select>
              </FormField>
              <FormField label="الماركة"><input className="input" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} /></FormField>
              <FormField label="وحدة القياس">
                <select className="input" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                  {["قطعة", "لتر", "كغ", "طقم", "متر"].map(u => <option key={u}>{u}</option>)}
                </select>
              </FormField>
              <FormField label="السعر (ر.س) *"><input className="input" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></FormField>
              <FormField label="الكمية في المخزون"><input className="input" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /></FormField>
              <FormField label="الحد الأدنى للمخزون"><input className="input" type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} /></FormField>
            </div>
            <FormField label="المورد">
              <select className="input" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })}>
                <option value="">-- اختر المورد --</option>
                {data.suppliers.map(s => <option key={s.id}>{s.name}</option>)}
              </select>
            </FormField>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" onClick={handleAdd}>حفظ</button>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// EMPLOYEES TAB
// ============================================================
function EmployeesTab({ data, updateData, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", dept: "", phone: "", email: "" });

  const handleAdd = () => {
    if (!form.name || !form.dept) return showToast("يرجى تعبئة الحقول الإلزامية", "error");
    updateData("employees", [...data.employees, { id: generateId("EMP"), ...form, status: "active" }]);
    setShowForm(false);
    setForm({ name: "", dept: "", phone: "", email: "" });
    showToast("تم إضافة الموظف بنجاح");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ color: "#64748B", fontSize: 13 }}>إجمالي الموظفين: <strong style={{ color: "#FF6B2B" }}>{data.employees.length}</strong></span>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ إضافة موظف</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {data.employees.map(emp => {
          const empVehicles = data.vehicles.filter(v => v.ownerId === emp.id);
          const empRequests = data.requests.filter(r => r.employeeId === emp.id);
          return (
            <div key={emp.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, #FF6B2B, #FF8C42)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "white" }}>
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{emp.name}</div>
                  <div style={{ fontSize: 12, color: "#FF6B2B" }}>{emp.dept}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 12, color: "#64748B" }}>📞 {emp.phone}</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>✉️ {emp.email}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
                <div style={{ background: "#0F1117", borderRadius: 8, padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#FF6B2B" }}>{empVehicles.length}</div>
                  <div style={{ fontSize: 10, color: "#64748B" }}>سيارة</div>
                </div>
                <div style={{ background: "#0F1117", borderRadius: 8, padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#3B82F6" }}>{empRequests.length}</div>
                  <div style={{ fontSize: 10, color: "#64748B" }}>طلب صيانة</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="btn btn-danger" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => { updateData("employees", data.employees.filter(e => e.id !== emp.id)); showToast("تم الحذف"); }}>حذف</button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, color: "#FF6B2B" }}>👤 إضافة موظف جديد</h2>
            <FormField label="الاسم الكامل *"><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></FormField>
            <FormField label="القسم *">
              <select className="input" value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
                <option value="">-- اختر القسم --</option>
                {["تقنية المعلومات", "الموارد البشرية", "المالية", "المشتريات", "الإدارة العامة", "العمليات", "المبيعات", "أخرى"].map(d => <option key={d}>{d}</option>)}
              </select>
            </FormField>
            <FormField label="رقم الجوال"><input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></FormField>
            <FormField label="البريد الإلكتروني"><input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></FormField>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" onClick={handleAdd}>حفظ</button>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SUPPLIERS TAB
// ============================================================
function SuppliersTab({ data, updateData, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", email: "", address: "", category: "", rating: 3 });

  const handleAdd = () => {
    if (!form.name) return showToast("يرجى إدخال اسم المورد", "error");
    updateData("suppliers", [...data.suppliers, { id: generateId("SUP"), ...form }]);
    setShowForm(false);
    setForm({ name: "", contact: "", email: "", address: "", category: "", rating: 3 });
    showToast("تم إضافة المورد بنجاح");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ color: "#64748B", fontSize: 13 }}>إجمالي الموردين: <strong style={{ color: "#FF6B2B" }}>{data.suppliers.length}</strong></span>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ إضافة مورد</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {data.suppliers.map(sup => {
          const supParts = data.parts.filter(p => p.supplier === sup.name);
          return (
            <div key={sup.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ fontSize: 32 }}>🏭</div>
                <div style={{ display: "flex", gap: 2 }}>{"★".repeat(sup.rating).split("").map((s, i) => <span key={i} style={{ color: "#F59E0B", fontSize: 14 }}>{s}</span>)}{"☆".repeat(5 - sup.rating).split("").map((s, i) => <span key={i} style={{ color: "#2D3148", fontSize: 14 }}>{s}</span>)}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{sup.name}</div>
              <div style={{ background: "#0F1117", display: "inline-block", borderRadius: 6, padding: "2px 8px", fontSize: 11, color: "#FF6B2B", marginBottom: 10 }}>{sup.category}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ fontSize: 12, color: "#64748B" }}>📞 {sup.contact}</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>✉️ {sup.email}</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>📍 {sup.address}</div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 6 }}>قطع الغيار المرتبطة: <strong style={{ color: "#FF6B2B" }}>{supParts.length}</strong></div>
              </div>
              <button className="btn btn-danger" style={{ fontSize: 11, padding: "4px 10px", marginTop: 12 }} onClick={() => { updateData("suppliers", data.suppliers.filter(s => s.id !== sup.id)); showToast("تم الحذف"); }}>حذف</button>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, color: "#FF6B2B" }}>🏭 إضافة مورد</h2>
            <FormField label="اسم المورد *"><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></FormField>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormField label="رقم التواصل"><input className="input" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} /></FormField>
              <FormField label="البريد الإلكتروني"><input className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></FormField>
            </div>
            <FormField label="العنوان"><input className="input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></FormField>
            <FormField label="تصنيف البضاعة"><input className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="فلاتر وزيوت" /></FormField>
            <FormField label="التقييم">
              <div style={{ display: "flex", gap: 8 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} className="btn" style={{ background: n <= form.rating ? "#F59E0B" : "#2D3148", color: n <= form.rating ? "#fff" : "#64748B", padding: "4px 12px", fontSize: 16 }} onClick={() => setForm({ ...form, rating: n })}>★</button>
                ))}
              </div>
            </FormField>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" onClick={handleAdd}>حفظ</button>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TECHNICIANS TAB
// ============================================================
function TechniciansTab({ data, updateData, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", specialty: "", phone: "" });

  const handleAdd = () => {
    if (!form.name) return showToast("يرجى إدخال اسم الفني", "error");
    updateData("technicians", [...data.technicians, { id: generateId("TECH"), ...form, status: "available" }]);
    setShowForm(false);
    setForm({ name: "", specialty: "", phone: "" });
    showToast("تم إضافة الفني بنجاح");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: "#1A1D27", border: "1px solid #2D3148", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
            متاح: <strong style={{ color: "#10B981" }}>{data.technicians.filter(t => t.status === "available").length}</strong>
          </div>
          <div style={{ background: "#1A1D27", border: "1px solid #2D3148", borderRadius: 8, padding: "6px 14px", fontSize: 12 }}>
            مشغول: <strong style={{ color: "#F59E0B" }}>{data.technicians.filter(t => t.status === "busy").length}</strong>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ إضافة فني</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {data.technicians.map(tech => {
          const st = STATUS_MAP[tech.status];
          const activeWOs = data.workOrders.filter(wo => wo.technicianId === tech.id && wo.status === "open");
          return (
            <div key={tech.id} className="card" style={{ padding: 20, borderColor: tech.status === "available" ? "rgba(16,185,129,0.3)" : "#2D3148" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ width: 52, height: 52, background: "#0F1117", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, border: `2px solid ${st.color}` }}>👨‍🔧</div>
                <span className="badge" style={{ background: st.bg, color: st.color }}>{st.label}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{tech.name}</div>
              <div style={{ fontSize: 12, color: "#FF6B2B", marginBottom: 10 }}>{tech.specialty}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>📞 {tech.phone}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 6 }}>أوامر عمل نشطة: <strong style={{ color: "#3B82F6" }}>{activeWOs.length}</strong></div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="btn" style={{ fontSize: 11, padding: "4px 10px", background: tech.status === "available" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)", color: tech.status === "available" ? "#F59E0B" : "#10B981" }}
                  onClick={() => { updateData("technicians", data.technicians.map(t => t.id === tech.id ? { ...t, status: t.status === "available" ? "busy" : "available" } : t)); }}>
                  {tech.status === "available" ? "تعيين كمشغول" : "تعيين كمتاح"}
                </button>
                <button className="btn btn-danger" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => { updateData("technicians", data.technicians.filter(t => t.id !== tech.id)); showToast("تم الحذف"); }}>حذف</button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, color: "#FF6B2B" }}>👨‍🔧 إضافة فني</h2>
            <FormField label="الاسم الكامل *"><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></FormField>
            <FormField label="التخصص">
              <select className="input" value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })}>
                <option value="">-- اختر التخصص --</option>
                {["محرك وناقل حركة", "كهرباء وإلكترونيات", "هيكل وطلاء", "تكييف", "فرامل وتعليق", "إطارات وموازنة", "عام"].map(s => <option key={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="رقم الجوال"><input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></FormField>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" onClick={handleAdd}>حفظ</button>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// REPORTS TAB
// ============================================================
function ReportsTab({ data }) {
  const totalPartsValue = data.parts.reduce((sum, p) => sum + p.stock * p.price, 0);
  const totalMaintenanceCost = data.workOrders.reduce((sum, wo) => {
    return sum + wo.parts.reduce((s, p) => s + p.qty * p.unitPrice, 0) + wo.laborCost;
  }, 0);

  const reqByType = {};
  data.requests.forEach(r => { reqByType[r.type] = (reqByType[r.type] || 0) + 1; });

  const reqByStatus = {};
  data.requests.forEach(r => { reqByStatus[r.status] = (reqByStatus[r.status] || 0) + 1; });

  const partsByCategory = {};
  data.parts.forEach(p => { partsByCategory[p.category] = (partsByCategory[p.category] || 0) + p.stock * p.price; });

  const completionRate = data.requests.length > 0 ? Math.round((data.requests.filter(r => r.status === "completed").length / data.requests.length) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {[
          { label: "إجمالي قيمة المخزون", value: formatCurrency(totalPartsValue), color: "#3B82F6", icon: "📦" },
          { label: "إجمالي تكاليف الصيانة", value: formatCurrency(totalMaintenanceCost), color: "#FF6B2B", icon: "💰" },
          { label: "معدل إتمام الطلبات", value: `${completionRate}%`, color: "#10B981", icon: "✅" },
          { label: "متوسط أوامر العمل", value: formatCurrency(data.workOrders.length > 0 ? totalMaintenanceCost / data.workOrders.length : 0), color: "#F59E0B", icon: "📊" },
        ].map((kpi, i) => (
          <div key={i} className="stat-card" style={{ textAlign: "center" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 4, height: "100%", background: kpi.color, borderRadius: "14px 0 0 14px" }} />
            <div style={{ fontSize: 30, marginBottom: 8 }}>{kpi.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: kpi.color }}>{kpi.value}</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        {/* Requests by Type */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#E2E8F0" }}>الطلبات حسب النوع</h3>
          {Object.entries(reqByType).map(([type, count]) => {
            const pct = Math.round((count / data.requests.length) * 100);
            return (
              <div key={type} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12 }}>{type}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#FF6B2B" }}>{count}</span>
                </div>
                <div style={{ background: "#0F1117", borderRadius: 4, height: 6 }}>
                  <div style={{ background: "linear-gradient(90deg, #FF6B2B, #FF8C42)", height: "100%", borderRadius: 4, width: `${pct}%`, transition: "width 0.5s" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Requests by Status */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#E2E8F0" }}>الطلبات حسب الحالة</h3>
          {Object.entries(reqByStatus).map(([status, count]) => {
            const st = STATUS_MAP[status];
            const pct = Math.round((count / data.requests.length) * 100);
            return (
              <div key={status} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12 }}>{st?.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: st?.color }}>{count}</span>
                </div>
                <div style={{ background: "#0F1117", borderRadius: 4, height: 6 }}>
                  <div style={{ background: st?.color, height: "100%", borderRadius: 4, width: `${pct}%`, transition: "width 0.5s" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Parts by Category Value */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#E2E8F0" }}>قيمة المخزون بالتصنيف</h3>
          {Object.entries(partsByCategory).sort(([, a], [, b]) => b - a).map(([cat, val]) => {
            const pct = Math.round((val / totalPartsValue) * 100);
            return (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12 }}>{cat}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981" }}>{formatCurrency(val)}</span>
                </div>
                <div style={{ background: "#0F1117", borderRadius: 4, height: 6 }}>
                  <div style={{ background: "linear-gradient(90deg, #10B981, #34D399)", height: "100%", borderRadius: 4, width: `${pct}%`, transition: "width 0.5s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Work Orders Summary Table */}
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#E2E8F0" }}>ملخص أوامر العمل</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#13151F" }}>
                {["رقم الأمر", "الفني", "السيارة", "تكلفة القطع", "أجر العمل", "الإجمالي", "الحالة"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", fontSize: 12, color: "#64748B", textAlign: "right" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.workOrders.map(wo => {
                const vehicle = data.vehicles.find(v => v.id === wo.vehicleId);
                const partsCost = wo.parts.reduce((s, p) => s + p.qty * p.unitPrice, 0);
                const total = partsCost + wo.laborCost;
                const st = STATUS_MAP[wo.status];
                return (
                  <tr key={wo.id} className="table-row">
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "#FF6B2B", fontWeight: 700 }}>{wo.id}</td>
                    <td style={{ padding: "10px 14px", fontSize: 13 }}>{wo.technicianName}</td>
                    <td style={{ padding: "10px 14px", fontSize: 13 }}>{vehicle?.make} {vehicle?.model}</td>
                    <td style={{ padding: "10px 14px", fontSize: 13 }}>{formatCurrency(partsCost)}</td>
                    <td style={{ padding: "10px 14px", fontSize: 13 }}>{formatCurrency(wo.laborCost)}</td>
                    <td style={{ padding: "10px 14px", fontSize: 14, fontWeight: 800, color: "#FF6B2B" }}>{formatCurrency(total)}</td>
                    <td style={{ padding: "10px 14px" }}><span className="badge" style={{ background: st.bg, color: st.color }}>{st.label}</span></td>
                  </tr>
                );
              })}
              <tr style={{ background: "#13151F" }}>
                <td colSpan={5} style={{ padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "#94A3B8", textAlign: "left" }}>الإجمالي الكلي</td>
                <td style={{ padding: "10px 14px", fontSize: 16, fontWeight: 900, color: "#FF6B2B" }}>{formatCurrency(totalMaintenanceCost)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SHARED COMPONENTS
// ============================================================
function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="label">{label}</div>
      {children}
    </div>
  );
}
