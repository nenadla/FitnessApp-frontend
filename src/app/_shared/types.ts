export interface Toast{
    show: boolean;
    title?: string;
    text?: string;
    type?: 'success' | 'error' | 'warning';
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
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
  clickable?: boolean;
  appearance?: 'link' | 'text';
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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordFormModel extends ForgotPasswordRequest {}

export interface ResetPasswordRequest {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordFormModel {
  newPassword: string;
  confirmPassword: string;
}

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

export interface UserActivePackageResponse {
  id: string;
  userId: string;
  purchaseType: PurchaseType;
  totalSessions: number;
  remainingSessions: number;
  carriedOverSessions: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  isActive: boolean;
  isExpired: boolean;
  notes?: string | null;
  expirationReminderSentAt?: string | null;
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
  isFavorite: boolean;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  userStatus: UserStatus;
  activePackage?: UserActivePackageResponse | null;
  totalRemainingSessions: number;
  verifiedAt?: string | null;
  blockedAt?: string | null;
  unblockedAt?: string | null;
  createdAt: string;
}

export interface UserListRequest {
  favoritesOnly?: boolean;
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

export interface UpdateBalanceRequest {
  remainingSessions: number;
}

export interface BalanceResponse {
  id: string;
  userId: string;
  remainingSessions: number;
  isActive: boolean;
}

export interface RemainingSessionsDialogData {
  balanceId: string;
  userFullName: string;
  remainingSessions: number;
}

export interface RemainingSessionsDialogResult {
  saved: true;
  message: string;
}

export enum PurchaseType {
  Package12 = 1,
  Package6 = 2,
  SingleSessions = 3,
  Package16 = 4,
}

export interface MembershipHistoryResponse {
  id: string;
  purchaseType: PurchaseType;
  packageName: string;
  startDate: string;
  paymentDate: string;
  endDate: string;
  totalSessions: number;
  remainingSessions: number;
  isCurrentlyActive: boolean;
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

export interface LandingPackageResponse {
  title: string;
  subtitle: string;
  description: string;
  learnMoreDescription: string;
  details: string[];
  badge: string | null;
  features: string[];
  price: string;
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
  confirmPassword: string;
}

export interface UpdateProfileFormModel extends UpdateProfileRequest {}

export interface ChangePasswordFormModel extends ChangePasswordRequest {}
