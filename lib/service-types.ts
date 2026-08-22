export const SERVICE_TYPES = [
  { value: "work-permit", label: "Work Permit" },
  { value: "tourist-visas", label: "Tourist Visas" },
  { value: "business-invitation", label: "Business Invitation" },
  { value: "company-formation", label: "Company Formation" },
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number]["value"];

export const SERVICE_TYPE_VALUES = SERVICE_TYPES.map((item) => item.value);

export const SERVICE_TYPE_SECTIONS: Array<{
  type: ServiceType;
  heading: string;
  emoji: string;
}> = [
  {
    type: "work-permit",
    heading: "Work Permit Services With Job",
    emoji: "🛂",
  },
  {
    type: "tourist-visas",
    heading: "Tourist Visa Services",
    emoji: "🌍",
  },
  {
    type: "business-invitation",
    heading: "Business Visa Invitations",
    emoji: "💼",
  },
  {
    type: "company-formation",
    heading: "Company Formations & Tax Services",
    emoji: "🏢",
  },
];

export function serviceTypeLabel(type: ServiceType | string) {
  return (
    SERVICE_TYPES.find((item) => item.value === type)?.label ?? type
  );
}

export function groupServicesByType<
  T extends { type: string },
>(services: T[]) {
  return SERVICE_TYPE_SECTIONS.map((section) => ({
    ...section,
    services: services.filter((service) => service.type === section.type),
  }));
}
