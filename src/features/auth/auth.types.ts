import { auth } from "@/config/auth";

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
export type AuthSession = typeof auth.$Infer.Session;
export type Member = typeof auth.$Infer.Member;
export type Organization = typeof auth.$Infer.Organization;
export type ActiveOrganization = typeof auth.$Infer.ActiveOrganization;
export type Team = typeof auth.$Infer.Team;
