# Migration status

## Stage 1 - Foundation

- [x] Next.js App Router structure
- [x] Existing MVC CSS/assets copied where needed
- [x] Login UI reproduced from `Views/UserLogin/UserLogin.cshtml`
- [x] Login calls existing `POST /UserLogin/Vallidateuser`
- [x] ASP.NET session cookie proxying
- [x] Shared Header
- [x] Dynamic Sidebar using existing `GET /UserLogin/Getmenuinfobyuser`
- [x] Dashboard cards using existing `GET /UserLogin/GetAppointmentDashboardSummary`

## Stage 2 - Next

- [ ] AddPatient
- [ ] ViewUpdate
- [ ] PatientHistory
- [ ] AddDoctor
- [ ] Viewdoctor
- [ ] CreateAppointment
- [ ] BookAppointment
- [ ] ViewAppointMent
- [ ] Prescription UI
- [ ] Payment UI
- [ ] Print/slip UI
- [ ] Speech-to-text UI

Do not change the ASP.NET backend while completing these UI migrations unless a specific integration blocker is identified and explicitly approved.
