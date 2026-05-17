export interface GhanaBank {
  code: string;
  name: string;
  shortName?: string;
}

export const GHANA_BANKS: GhanaBank[] = [
  { code: "fidelity", name: "Fidelity Bank Ghana", shortName: "Fidelity" },
  { code: "gcb", name: "Ghana Commercial Bank", shortName: "GCB" },
  { code: "ecobank", name: "Ecobank Ghana", shortName: "Ecobank" },
  { code: "stanbic", name: "Stanbic Bank Ghana", shortName: "Stanbic" },
  { code: "access", name: "Access Bank Ghana", shortName: "Access" },
  { code: "calbank", name: "CalBank Ghana", shortName: "CalBank" },
  { code: "adb", name: "Agricultural Development Bank", shortName: "ADB" },
  { code: "zenith", name: "Zenith Bank Ghana", shortName: "Zenith" },
  { code: "gtbank", name: "Guaranty Trust Bank (Ghana)", shortName: "GTBank" },
  { code: "unibank", name: "UniBank Ghana", shortName: "UniBank" },
  { code: "firstbank", name: "First Bank of Ghana", shortName: "FirstBank" },
  { code: "sgssb", name: "Société Générale Ghana", shortName: "SG Ghana" },
  { code: "citibank", name: "Citibank Ghana", shortName: "Citi" },
  { code: "premier", name: "Premier Bank Ghana", shortName: "Premier" },
  { code: "stamp", name: "Stamp Technologies Bank", shortName: "Stamp" },
  { code: "母", name: "Bank of Ghana", shortName: "BoG" },
  { code: "overland", name: "Overland Money Solutions Bank", shortName: "Overland" },
  { code: "vuniversity", name: "Ghana Commercial Bank (University Branch)", shortName: "GCB" },
  { code: "国民", name: "Treasury Bank", shortName: "Treasury" },
  { code: "vrab", name: "Ghana Commercial Bank (VRAB)", shortName: "GCB" },
  { code: "mbank", name: "MultiTV Bank", shortName: "mBank" },
];

export const getBankByCode = (code: string): GhanaBank | undefined => {
  return GHANA_BANKS.find((bank) => bank.code === code);
};

export const formatBankName = (bank: GhanaBank): string => {
  return bank.shortName ? `${bank.name} (${bank.shortName})` : bank.name;
};