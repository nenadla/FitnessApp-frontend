export interface Toast{
    show: boolean;
    title?: string;
    text?: string;
    type?: 'success' | 'error' | 'warning';
}
export interface NavItem{
  name: string;
  link: string;
  icon: string;
  iconFill: boolean;
  visible: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}


// USER
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  company: string;
  companyId: string;
  role: string;
  dateAdded: string;
  status: string;
  phone: string;
  title: string;
  roleIS: string;
  capabilitiesIS: string[];
  isCustoms: boolean;
  accessIS: boolean;
  accessRP: boolean;
  organizations: Organization[];
  lastLoginAtUtc: string | null;
  statusChangedAtUtc: string | null;
}
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyId: string;
  createdDate: string;

  accessRP: boolean;
  authUserTermsAndConditions: boolean;
  acceptTermsOfUse: boolean;

  accessIS: boolean;
  authUserTermsAndConditionsIS: boolean;
  acceptTermsOfUseIS: boolean;
  features: UserProfileFeatures;
}
export interface UserProfileFeatures {
  emailNotificationPreferencesEnabled: boolean;
  adminReportsEnabled: boolean;
}
export interface UpdateTerms {
  authUserTermsAndConditions: boolean;
  acceptTermsOfUse: boolean;
  authUserTermsAndConditionsIS: boolean;
  acceptTermsOfUseIS: boolean;
}
export interface EmailNotificationPreferences {
  notifyOnInvoicesReady: boolean;
  notifyOnClientListReady: boolean;
}

//OKTA MFA Factor
export interface OktaFactor {
  id: string;
  factorType: string;
  provider: string;
  vendorName: string;
  status: string;
  created: string | null;
  lastUpdated: string | null;
  profile: OktaFactorProfile;
  embedded?: OktaFactorEmbedded;
}
export interface OktaFactorProfile {
  credentialId: string;
  phoneNumber: string;
  question: string;
  questionText: string;
  email: string;
}
export interface OktaFactorEmbedded {
  activation: OktaFactorActivation;
}
export interface OktaFactorActivation {
  timeStep: number;
  sharedSecret: string;
  encoding: string;
  keyLength: number;
  factorResult: string;
  links: OktaFactorActivationLinks;
}
export interface OktaFactorActivationLinks {
  qrcode: OktaFactorLink;
}
export interface OktaFactorLink {
  href: string;
}

// Okta user profile (admin read-only view in the user dialog).
export interface OktaUser {
  id: string;
  status: string;
  created: string | null;
  activated: string | null;
  statusChanged: string | null;
  lastLogin: string | null;
  profile: OktaUserProfile;
  isInMfaGroup: boolean | null;
}
export interface OktaUserProfile {
  firstName: string;
  lastName: string;
  email: string;
  login: string;
}

// Organization
export interface Organization {
  id: string;
  name: string;
  organizationCode: string;
  subscriptionType: string;
  nfc: boolean;
  fc: boolean;
  status: string;
  contractEndDateUtc: string | null;
  users: User[] | null;
}
export interface OrganizationCreateUpdate {
  name: string;
  organizationCode: string;
  subscriptionType: string;
  nfc: boolean;
  fc: boolean;
  status: string;
  contractEndDateUtc?: string | null;
}
export interface OrganizationCodeDropdownItem {
  name: string;
  organizationCode: string;
  firstInvoiced: string | null;
}

// Formularies
export interface Formulary {
  id: string;
  formularyName: string;
  formularyId: string;
  year: number;
  programCode: string;
  effectiveDate: string;
  updatedDate: string;
  hasPreview: boolean;
}
export interface FormularyCreate {
  FormularyName: string;
  FormularyCode: string;
  Year: number;
  EffectiveDate: string;
  File: File;
}

export interface FormularyFilters {
  names: string[];
  formularyIds: string[];
  yearFrom: number | null;
  yearTo: number | null;
  effectiveFrom: string | null; 
  effectiveTo: string | null;   
}

// ClientList
export interface ClientList {
  id: string;
  clientListName: string;
  year: number;
  month: number;
  programCode: string;
  updatedDate: string;
  hasPreview: boolean;
}
export interface ClientListCreate {
  ClientListName: string;
  PeriodDate: string;
  File: File;
}

// Supplementary files
export interface SupplementaryFile {
  id: string;
  organizationId: string;
  organizationName: string;
  fileType: string;
  effectiveDate: string;
  rebateProgram: string;
  fileName: string;
  sizeBytes: number;
  lastUpdatedAtUtc: string;
}

export interface SupplementaryFileCreate {
  OrganizationId: string;
  FileType: string;
  EffectiveDate: string;
  File: File;
}

// Invoices
export interface Invoice {
  id: string;
  organizationId: string;
  fileName: string;
  marketType: string;
  monthDate: string;
  type: string;
  sizeBytes: number;
  hasPreview: boolean;
}


// Exception
export interface DafException {
  id: string;
  organization: Organization;
  gpiCode: string;
  gpiLabel: string;
  information?: string | null;
  formularyDaf: string;
}
export interface DafExceptionCreateUpdate {
  organizationId: string;
  gpiCode: string;
  gpiLabel: string;
  information?: string | null;
  formularyDaf: string;
}

export interface PharmaDafAccessItem {
  organizationCode: string;
  organizationName: string;
  codeType: string;
  code: string;
  codeDesc: string;
  accessType: string;
  sourceAccessType: string;
  mfrException: boolean;
  enhancedSub: boolean;
  gpiException: boolean;
  type: string;
}

// Company
export interface Company {
  id: string;
  companyType: number;
  name: string;
  tier:string | null;
  manufacturerCode: string | null;
  consultantCode:string | null;
  status?:number;
  participantCategory?:number;
  abbreviation?:string;
  onboardingDate?:string;
  parentParticipantId?:string;
  isCustoms?: boolean;
  organizations: Organization[];
}
export interface CompanyRole {
  id: string;
  companyName: string;
  companyType: string;
  roles: string[];
  rolesIS: string[];
}
export interface Manufacturer {
  id: string;
  name: string;
  companyType: string;
}



// Analytics Reports
export interface EmbedInfo{
  reportId: string;
  embedUrl: string;
  accessToken: string;
  expiration: string;
}
export interface PbiReport{
  id: string;
  name: string;
}
export interface DashboardItem{
  id: string;
  organizationId: string;
  dashboardId?: string;
  dashboardKey: string;
  name: string;
  category: string;
  description: string;
  tooltipText: string;
  hasAccess: boolean;
  isExportEnabled: boolean;
}

export interface PbiVisual {
  visualKey: string; // identifier
  title: string; // label to show what is selected
  reportId: string; // associated report ID
  pageName: string; // page id
  visualName: string; // visual id
  isExportEnabled?: boolean;
  embedInfo?: EmbedInfo;
}

export interface PbiChartData {
  chartKey: string;
  lastTotalInvoiceAmount: number;
  totalInvoiceOverTime: TotalInvoicePoint[];
  claimVolumeOverTime: ClaimVolumePoint[];
  manufacturerTopInvoicedDrugs: ManufacturerTopInvoicedDrug[];
  manufacturerTopDrugsByParticipant: ManufacturerTopDrugByParticipant[];
  manufacturerTopFormularies: ManufacturerTopFormulary[];
}

export interface TotalInvoicePoint {
  yearMonth: string;
  totalInvoice: number;
}

export interface ClaimVolumePoint {
  yearMonth: string;
  claimVolume: number;
}

export interface ManufacturerTopInvoicedDrug {
  yearMonth: string;
  brand: string;
  totalClaims: number;
}

export interface ManufacturerTopDrugByParticipant {
  participant: string;
  brand: string;
  totalClaims: number;
}

export interface ManufacturerTopFormulary {
  yearMonth: string;
  formularyName: string;
  totalClaims: number;
}

//Reports
export interface OverviewReport{
  id: string;
  name: string;
  group: string;
  description: string;
  tooltipText: string;
  reportOptions: OverviewReportOption[];
  reportPreview: OverviewReportPreview[];
}

export interface OverviewReportOption{
  id: string;
  label: string;
  description: string;
};

export interface OverviewReportPreview{
  reportName: string;
  columns: ColumnPreview[];
};

export interface ColumnPreview{
  alias: string;
  description: string;
}

//Admin Reports
export interface AdminOverviewReport{
  id: string;
  name: string;
  group: string;
  description: string;
  tooltipText: string;
  reportOptions: AdminOverviewReportOption[];
  reportPreview: AdminOverviewReportPreview[];
}

export interface AdminOverviewReportOption{
  id: string;
  label: string;
  description: string;
};

export interface AdminOverviewReportPreview{
  reportName: string;
  columns: ColumnPreview[];
};

export interface AdminDafSetupRow {
  code: string;
  codeType: 'GPI' | 'CPC' | string;
  codeDesc: string;
  accessType: string;
}

export interface AdminCodeLookupResponse {
  gpis: AdminCodeLookupItem[];
  cpcs: AdminCodeLookupItem[];
}

export interface AdminCodeLookupItem {
  id: string;
  label: string;
}

export interface AdminReportDafProduct {
  id: string;
  accessType: string;
}

export interface AdminReportCreateRequest {
  reportId: string;
  reportOptionId: string;
  organizationId: string;
  title: string;
  exportFormat: string;
  filledMonthFrom: string;
  filledMonthTo: string;
  genericProducts: AdminReportDafProduct[];
  competitiveProducts: AdminReportDafProduct[];
}

export interface AdminReportRun {
  runId: string;
  reportName: string;
  runStatus: string;
  startedTimeUtc: string;
  completedTimeUtc: string;
  actualExportFormat: string;
  sizeBytes: number;
}

export interface AdminScheduledReportRun {
  scheduleId: string;
  isActive: boolean;
  lastRunMonth: string;
  lastRunStatus: string;
  reportName: string;
  createdAtUtc: string;
  updatedAtUtc: string;
  reportRuns: AdminReportRun[];
}

export interface AdminReportDownloadLink {
  url: string;
  expiresOn: string;
}

export interface AdminReportFormModel {
  reportId: string;
  reportOptionId: string;
  organizationId: string;
  title: string;
  mode: string;
  exportFormat: string;
  parameters: AdminReportParametersFormModel;
}

export interface AdminReportParametersFormModel {
  filledMonthFrom: Date | null;
  filledMonthTo: Date | null;
}



export interface ReportTemplate {
  id?: string; // GUID
  reportId: string; // GUID
  reportOptionId: string; // GUID
  organizationId: string; // GUID
  reportOptionLabel?: string;
  title: string;
  description?: string;
  mode: string;
  exportFormat: string;
  schedule: ReportTemplateSchedule;
  mafParameters: MafReportTemplateParameters;
  dafParameters: DafReportTemplateParameters;
}

export interface ReportTemplateSchedule {
  frequency: string; //Monthly only for now
  startDate: string; 
  runOnDayOfMonth: number;
  endDate?: string; 
}

export interface DafReportTemplateParameters {
  filledMonthFrom?: string;
  filledMonthTo?: string;
  genericProduct?: ReportTemplateParameter;
  competitiveProduct?: ReportTemplateParameter;
  marketBasket?: ReportTemplateParameter;
  carriers?: ReportTemplateParameter[];
  formularies?: ReportTemplateParameter[];
  products?: ReportTemplateParameter[];
  prescribers?: ReportTemplateParameter[];
  prescriberStates?: ReportTemplateParameter[];
  prescriberRank?: string;
}

export interface MafReportTemplateParameters {
  filledMonths: string[];
  processedMonth: string; 
  carriers: ReportTemplateParameter[];
  formularies: ReportTemplateParameter[];
  products: ReportTemplateParameter[];
}

export interface DafTemplateParameterSearch {
  reportId: string;
  reportOptionId: string;
  organizationId: string;
  filledMonthFrom?: string;
  filledMonthTo?: string;
  genericProductStartsWith?: string;
  genericProductId?: string;
  competitiveProductStartsWith?: string;
  competitiveProductId?: string;
  marketBasketId?: string;
  carrierStartsWith?: string;
  carrierIds?: string[];
  formularyStartsWith?: string;
  formularyIds?: string[];
  productStartsWith?: string;
  productIds?: string[];
  prescriberStates?: string[];
  prescriberStartsWith?: string;
  prescriberIds?: string[];
}
export interface MafTemplateParameterSearch {
  reportId: string;
  reportOptionId: string;
  organizationId: string;
  processedMonth?: string;
  filledMonths?: string[];

  carrierStartsWith?: string;
  carrierIds?: string[];
  formularyStartsWith?: string;
  formularyIds?: string[];
  productStartsWith?: string;
  productIds?: string[];
}
export interface ReportTemplateParameter {
  id: string;
  label: string;
}

export interface AvailableMonthsResponse {
  mafInvoiceMonths: string[];
  dafFillMonths: string[];
}

export interface ReportScheduleFormModel {
  frequency: string;
  startDate: Date | null;
  runOnDayOfMonth: number;
  endDate: Date | null;
}

export interface ReportParametersFormModel {
  processedMonth: Date | null;
  filledMonths: Date[];
  filledMonthFrom: Date | null;
  filledMonthTo: Date | null;
  genericProduct: ReportTemplateParameter | null;
  competitiveProduct: ReportTemplateParameter | null;
  marketBasket: ReportTemplateParameter | null;
  carriers: ReportTemplateParameter[];
  formularies: ReportTemplateParameter[];
  products: ReportTemplateParameter[];
  prescribers: ReportTemplateParameter[];
  prescriberStates: ReportTemplateParameter[];
  prescriberRank: string | null;
}

export interface ReportFormModel {
  reportId: string;
  reportOptionId: string;
  organizationId: string;
  title: string;
  mode: string;
  exportFormat: string;
  schedule: ReportScheduleFormModel;
  parameters: ReportParametersFormModel;
}

export interface ReportRun {
  runId: string;
  reportName: string;
  runStatus: string;
  startedTimeUtc: string;
  completedTimeUtc: string;
  actualExportFormat: string;
  sizeBytes: number;
  scheduleType?: string;
}




// Authentication
export type UserRole = 'Admin' | 'Korisnik';

export enum UserStatus {
  Unverified = 1,
  Verified = 2,
  Blocked = 3,
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface MobileDataCardDetail {
  label: string;
  value: string | number | null | undefined;
}

export type MobileDataCardStatusTone = 'success' | 'error' | 'primary';

export interface EmptyResponse {}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginFormModel extends LoginRequest {}

export interface RegisterFormModel extends Omit<RegisterRequest, 'dateOfBirth'> {
  confirmPassword: string;
  dateOfBirth: Date | null;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RevokeTokenRequest {
  refreshToken: string;
}

export interface CurrentUserResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  userStatus: UserStatus;
}

export interface AuthResponse extends CurrentUserResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface NavigationItem {
  label: string;
  link: string;
  icon: string;
  roles?: UserRole[];
}

export interface TrainingCalendarResponse {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  capacity: number;
  reservedCount: number;
  availableSpots: number;
  trainerName: string;
  location: string;
  isCancelled: boolean;
}

export interface TrainingSessionResponse extends TrainingCalendarResponse {
  description: string;
  cancellationReason?: string | null;
}

export interface TrainingListRequest {
  date?: string;
  isCancelled?: boolean;
  activeOnly?: boolean;
}

export interface CreateTrainingSessionRequest {
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  capacity: number;
  trainerName?: string | null;
  location?: string | null;
}

export interface UpdateTrainingSessionRequest {
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  capacity: number;
  isCancelled: boolean;
  cancellationReason?: string | null;
}

export interface CreateTrainingSessionFormModel {
  title: string;
  description: string | null;
  date: Date | null;
  startTime: string;
  endTime: string;
  capacity: number;
  trainerName: string | null;
  location: string | null;
}

export type TrainingDialogMode = 'create' | 'edit';

export interface TrainingDialogData {
  mode: TrainingDialogMode;
  training?: TrainingSessionResponse;
}

export type TrainingDialogResult =
  | { mode: 'create'; request: CreateTrainingSessionRequest }
  | { mode: 'edit'; id: string; request: UpdateTrainingSessionRequest }
  | false
  | undefined;

export interface TrainingSearchFormModel {
  search: string;
}

export enum ReservationStatus {
  Reserved = 1,
  Cancelled = 2,
  Attended = 3,
  NoShow = 4,
}

export interface ReservationResponse {
  id: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  trainingSessionId: string;
  trainingTitle: string;
  trainingStartTime: string;
  trainingEndTime: string;
  trainerName: string;
  location: string;
  status: ReservationStatus;
  reservedAt: string;
  cancelledAt?: string | null;
  cancelledByUser: boolean;
  cancelledByAdmin: boolean;
  attendedAt?: string | null;
  noShowAt?: string | null;
  reminderSentAt?: string | null;
  autoMarkedAttended: boolean;
  autoMarkedAt?: string | null;
  notes?: string | null;
}

export interface DashboardActiveMembershipResponse {
  paymentId?: string | null;
  paymentType: PurchaseType;
  numberOfSessions: number;
  remainingSessions: number;
  startDate: string;
  endDate?: string | null;
  status: string;
}

export interface DashboardUpcomingReservationResponse {
  trainingSessionId: string;
  trainingTitle: string;
  trainingStartTime: string;
  trainingEndTime: string;
  trainerName: string;
}

export interface UserDashboardResponse {
  activeMembership?: DashboardActiveMembershipResponse | null;
  upcomingReservations: DashboardUpcomingReservationResponse[];
  latestNotifications: NotificationResponse[];
  unreadNotificationsCount: number;
}

export interface CreateReservationRequest {
  trainingSessionId: string;
  notes?: string | null;
}

export interface ReservationListRequest {
  page?: number;
  pageSize?: number;
  trainingSessionId?: string;
}

export interface ReservationPaginatedResponse {
  items: ReservationResponse[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface TrainingReservationsDialogData {
  training: TrainingCalendarResponse;
}

export interface UserListResponse {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  userStatus: UserStatus;
  verifiedAt?: string | null;
  blockedAt?: string | null;
  unblockedAt?: string | null;
  createdAt: string;
}

export interface UserListRequest {
  page?: number;
  pageSize?: number;
  status?: UserStatus;
  search?: string;
}

export interface UserPaginatedResponse {
  items: UserListResponse[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export type UserStatusAction = 'verify' | 'block' | 'unblock';

export interface UserStatusDialogData {
  user: UserListResponse;
}

export enum PurchaseType {
  Package12 = 1,
  Package6 = 2,
  SingleSessions = 3,
  Package16 = 4,
}

export interface PaymentResponse {
  id: string;
  userId: string;
  userFullName: string;
  amount: number;
  paymentDate: string;
  startDate?: string | null;
  paymentType: PurchaseType;
  numberOfSessions: number;
  note?: string | null;
  createdAt: string;
  createdByAdminId?: string | null;
}

export interface PaymentListRequest {
  page?: number;
  pageSize?: number;
  paymentType?: PurchaseType;
  userId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

export interface PaymentPaginatedResponse {
  items: PaymentResponse[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface AvailablePackageResponse {
  purchaseType: PurchaseType;
  numberOfSessions: number;
}

export interface CreatePaymentRequest {
  userId: string;
  amount: number;
  paymentDate: string;
  paymentType: PurchaseType;
  numberOfSessions?: number | null;
  note?: string | null;
  startDate?: string | null;
}

export interface CreatePaymentFormModel {
  userId: string;
  userSearch: string;
  amount: number;
  paymentType: PurchaseType;
  numberOfSessions: number | null;
  note: string | null;
  startDate: Date | null;
}

export type PaymentDialogMode = 'create' | 'edit';

export interface PaymentDialogData {
  mode: PaymentDialogMode;
  payment?: PaymentResponse;
}

export type PaymentDialogResult =
  | { mode: 'create'; request: CreatePaymentRequest }
  | { mode: 'edit'; id: string; request: UpdatePaymentRequest }
  | false
  | undefined;

export interface UpdatePaymentRequest {
  amount: number;
  paymentDate: string;
  startDate?: string | null;
  note?: string | null;
}

export enum NotificationType {
  General = 1,
  TrainingCancelled = 2,
  TrainingUpdated = 3,
  MembershipExpiring = 4,
  System = 5,
}

export interface NotificationResponse {
  id: string;
  userNotificationId?: string | null;
  title: string;
  message: string;
  type: NotificationType;
  sendEmail: boolean;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  createdByAdminId?: string | null;
}

export interface NotificationListRequest {
  page?: number;
  pageSize?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: NotificationType;
  sendEmail: boolean;
}

export interface CreateNotificationFormModel extends CreateNotificationRequest {}

export interface NotificationDetailDialogData {
  notification: NotificationResponse;
  isAdmin: boolean;
}

export interface UserProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  userStatus: UserStatus;
  createdAt: string;
  updatedAt?: string | null;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileFormModel extends UpdateProfileRequest {}

export interface ChangePasswordFormModel extends ChangePasswordRequest {
  confirmPassword: string;
}
