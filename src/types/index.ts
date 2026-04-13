import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      dealershipId: string | null;
      image?: string | null;
    };
  }

  interface User {
    role: string;
    dealershipId: string | null;
  }
}

// Application types
export type Role = "CUSTOMER" | "DEALER" | "ADMIN";

export type VehicleStatus = "AVAILABLE" | "RESERVED" | "SOLD";

export type DocumentType =
  | "DRIVERS_LICENSE"
  | "PROOF_OF_INSURANCE"
  | "PROOF_OF_INCOME"
  | "TRADE_IN_PHOTO"
  | "OTHER";

export type DocStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CreditStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "PRE_APPROVED"
  | "DENIED"
  | "MORE_INFO_NEEDED";

export type AppointmentPurpose =
  | "TEST_DRIVE_AND_SIGN"
  | "TEST_DRIVE_ONLY"
  | "FINAL_SIGNING"
  | "CONSULTATION";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

export type Stage =
  | "APPLICATION_SUBMITTED"
  | "DOCUMENTS_UPLOADED"
  | "DOCUMENTS_REVIEWED"
  | "CREDIT_SUBMITTED"
  | "PRE_APPROVED"
  | "APPOINTMENT_SCHEDULED"
  | "APPOINTMENT_CONFIRMED"
  | "READY_FOR_VISIT"
  | "VISIT_COMPLETED";
