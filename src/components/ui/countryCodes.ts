/**
 * Country table (for PhoneInput) — ~240 countries.
 *
 * Each row: [ISO2, dialing code, national number length min, max, leading?]
 *   ["UZ", "998", 9, 9]                 → +998 88 765 43 23
 *   ["KZ", "7", 10, 10, ["6", "7"]]     → +7 701 234 56 78 (national part starts with 6/7)
 *   ["JM", "1", 10, 10, ["876", "658"]] → +1 876 123 4567
 * "Leading" — countries sharing a code with another (+7, +1, +44,
 * +590, +262…) are told apart by the first digits of the national part. Of the
 * rows with the same code, the first one without "leading" is that code's "main" country.
 *
 * An array, not an object: tree-shaking and size (≤ 25 KB). The flag is
 * computed from ISO2 (flagOf). Grouping: 20 explicit codes in PHONE_GROUPS, the
 * rest by length (groupsByLength). The E.164 result is unchanged: "+" + digits.
 */

export type CountryRow = [iso: string, dial: string, min: number, max: number, leading?: string[]];

export const COUNTRIES: CountryRow[] = [
  ["UZ","998",9,9], ["RU","7",10,10], ["KZ","7",10,10,["6","7"]], ["US","1",10,10], ["CA","1",10,10], ["GB","44",9,10],
  ["TR","90",10,10], ["KR","82",9,10], ["CN","86",10,11], ["IN","91",10,10], ["AE","971",8,9], ["UA","380",9,9],
  ["BY","375",9,9], ["KG","996",9,9], ["TJ","992",9,9], ["TM","993",8,8], ["AZ","994",9,9], ["GE","995",9,9],
  ["AM","374",8,8], ["DE","49",6,13], ["FR","33",9,9], ["SA","966",9,9], ["AF","93",9,9], ["AL","355",8,9],
  ["DZ","213",8,9], ["AS","1",10,10,["684"]], ["AD","376",6,9], ["AO","244",9,9], ["AI","1",10,10,["264"]], ["AG","1",10,10,["268"]],
  ["AR","54",10,11], ["AW","297",7,7], ["AU","61",9,9], ["AT","43",4,13], ["BS","1",10,10,["242"]], ["BH","973",8,8],
  ["BD","880",10,10], ["BB","1",10,10,["246"]], ["BE","32",8,9], ["BZ","501",7,7], ["BJ","229",8,10], ["BM","1",10,10,["441"]],
  ["BT","975",7,8], ["BO","591",8,8], ["BA","387",8,9], ["BW","267",7,8], ["BR","55",10,11], ["IO","246",7,7],
  ["VG","1",10,10,["284"]], ["BN","673",7,7], ["BG","359",8,9], ["BF","226",8,8], ["BI","257",8,8], ["KH","855",8,9],
  ["CM","237",9,9], ["CV","238",7,7], ["KY","1",10,10,["345"]], ["CF","236",8,8], ["TD","235",8,8], ["CL","56",9,9],
  ["CO","57",10,10], ["KM","269",7,7], ["CG","242",9,9], ["CD","243",9,9], ["CK","682",5,5], ["CR","506",8,8],
  ["CI","225",10,10], ["HR","385",8,9], ["CU","53",8,8], ["CW","599",7,8], ["CY","357",8,8], ["CZ","420",9,9],
  ["DK","45",8,8], ["DJ","253",8,8], ["DM","1",10,10,["767"]], ["DO","1",10,10,["809","829","849"]], ["EC","593",8,9], ["EG","20",9,10],
  ["SV","503",8,8], ["GQ","240",9,9], ["ER","291",7,7], ["EE","372",7,8], ["SZ","268",8,8], ["ET","251",9,9],
  ["FK","500",5,5], ["FO","298",6,6], ["FJ","679",7,7], ["FI","358",6,11], ["GF","594",9,9], ["PF","689",8,8],
  ["GA","241",7,8], ["GM","220",7,7], ["GH","233",9,9], ["GI","350",8,8], ["GR","30",10,10], ["GL","299",6,6],
  ["GD","1",10,10,["473"]], ["GP","590",9,9], ["GU","1",10,10,["671"]], ["GT","502",8,8], ["GG","44",10,10,["1481","7781","7839","7911"]], ["GN","224",9,9],
  ["GW","245",7,9], ["GY","592",7,7], ["HT","509",8,8], ["HN","504",8,8], ["HK","852",8,8], ["HU","36",8,9],
  ["IS","354",7,9], ["ID","62",9,12], ["IR","98",10,10], ["IQ","964",10,10], ["IE","353",7,9], ["IM","44",10,10,["1624","7524","7624","7924"]],
  ["IL","972",8,9], ["IT","39",6,11], ["JM","1",10,10,["876","658"]], ["JP","81",9,10], ["JE","44",10,10,["1534","7509","7700","7797","7829","7937"]], ["JO","962",8,9],
  ["KE","254",9,9], ["KI","686",5,8], ["XK","383",8,9], ["KW","965",8,8], ["LA","856",8,10], ["LV","371",8,8],
  ["LB","961",7,8], ["LS","266",8,8], ["LR","231",7,9], ["LY","218",9,9], ["LI","423",7,9], ["LT","370",8,8],
  ["LU","352",6,11], ["MO","853",8,8], ["MG","261",9,9], ["MW","265",7,9], ["MY","60",9,10], ["MV","960",7,7],
  ["ML","223",8,8], ["MT","356",8,8], ["MH","692",7,7], ["MQ","596",9,9], ["MR","222",8,8], ["MU","230",7,8],
  ["YT","262",9,9,["269","639"]], ["MX","52",10,10], ["FM","691",7,7], ["MD","373",8,8], ["MC","377",8,9], ["MN","976",8,8],
  ["ME","382",8,9], ["MS","1",10,10,["664"]], ["MA","212",9,9], ["MZ","258",8,9], ["MM","95",7,10], ["NA","264",8,9],
  ["NR","674",7,7], ["NP","977",8,10], ["NL","31",9,9], ["NC","687",6,6], ["NZ","64",8,10], ["NI","505",8,8],
  ["NE","227",8,8], ["NG","234",8,10], ["NU","683",4,4], ["NF","672",6,6], ["KP","850",8,10], ["MK","389",8,8],
  ["MP","1",10,10,["670"]], ["NO","47",8,8], ["OM","968",8,8], ["PK","92",10,10], ["PW","680",7,7], ["PS","970",9,9],
  ["PA","507",7,8], ["PG","675",7,8], ["PY","595",9,9], ["PE","51",8,9], ["PH","63",10,10], ["PL","48",9,9],
  ["PT","351",9,9], ["PR","1",10,10,["787","939"]], ["QA","974",8,8], ["RE","262",9,9], ["RO","40",9,9], ["RW","250",9,9],
  ["BL","590",9,9,["590"]], ["SH","290",4,5], ["KN","1",10,10,["869"]], ["LC","1",10,10,["758"]], ["MF","590",9,9,["590"]], ["PM","508",6,6],
  ["VC","1",10,10,["784"]], ["WS","685",5,7], ["SM","378",6,10], ["ST","239",7,7], ["SN","221",9,9], ["RS","381",8,9],
  ["SC","248",7,7], ["SL","232",8,8], ["SG","65",8,8], ["SX","1",10,10,["721"]], ["SK","421",9,9], ["SI","386",8,8],
  ["SB","677",5,7], ["SO","252",7,9], ["ZA","27",9,9], ["SS","211",9,9], ["ES","34",9,9], ["LK","94",9,9],
  ["SD","249",9,9], ["SR","597",6,7], ["SE","46",7,9], ["CH","41",9,9], ["SY","963",9,9], ["TW","886",8,9],
  ["TZ","255",9,9], ["TH","66",8,9], ["TL","670",7,8], ["TG","228",8,8], ["TK","690",4,7], ["TO","676",5,7],
  ["TT","1",10,10,["868"]], ["TN","216",8,8], ["TC","1",10,10,["649"]], ["TV","688",5,6], ["UG","256",9,9], ["UY","598",8,8],
  ["VU","678",5,7], ["VA","39",10,10,["06698"]], ["VE","58",10,10], ["VN","84",9,10], ["VI","1",10,10,["340"]], ["WF","681",6,6],
  ["EH","212",9,9,["528"]], ["YE","967",7,9], ["ZM","260",9,9], ["ZW","263",9,9], ["AX","358",6,10,["18"]], ["BQ","599",7,7,["3","4","7"]],
  ["CX","61",9,9,["89164"]], ["CC","61",9,9,["89162"]], ["AC","247",4,5], ["TA","290",4,4,["8"]], ["SJ","47",8,8,["79"]],
];

/** Explicit groups (display): 998 → [2,3,2,2] = "+998 88 765 43 23". */
export const PHONE_GROUPS: Record<string, number[]> = {
  "998": [2, 3, 2, 2],
  "7": [3, 3, 2, 2],
  "1": [3, 3, 4],
  "44": [4, 6],
  "90": [3, 3, 2, 2],
  "82": [2, 4, 4],
  "86": [3, 4, 4],
  "91": [5, 5],
  "971": [2, 3, 4],
  "380": [2, 3, 2, 2],
  "375": [2, 3, 2, 2],
  "996": [3, 3, 3],
  "992": [2, 3, 2, 2],
  "993": [2, 2, 2, 2],
  "994": [2, 3, 2, 2],
  "995": [3, 2, 2, 2],
  "374": [2, 3, 3],
  "49": [3, 8],
  "33": [1, 2, 2, 2, 2],
  "966": [2, 3, 4],
  "55": [2, 5, 4],
};

/** For a code with no explicit groups — by the national part's length. */
export function groupsByLength(n: number): number[] {
  if (n >= 12) return [3, 3, 3, 3];
  if (n === 11) return [3, 4, 4];
  if (n === 10) return [3, 3, 4];
  if (n === 9) return [2, 3, 4];
  if (n === 8) return [4, 4];
  if (n === 7) return [3, 4];
  return [n];
}

/** Old name (kept for compatibility): the fallback groups of a code with none. */
export const FALLBACK_GROUPS = [3, 3, 4];

/** Every dialing code (no duplicates). */
export const COUNTRY_CODES: string[] = Array.from(new Set(COUNTRIES.map((c) => c[1])));

/** ISO2 → flag emoji ("UZ" → 🇺🇿). */
export function flagOf(iso: string): string {
  return String(iso ?? "")
    .toUpperCase()
    .replace(/[A-Z]/g, (ch) => String.fromCodePoint(0x1f1e6 + ch.charCodeAt(0) - 65));
}

export interface Country {
  iso: string;
  dial: string;
  min: number;
  max: number;
}

function toCountry(row: CountryRow): Country {
  return { iso: row[0], dial: row[1], min: row[2], max: row[3] };
}

/**
 * The country from the leading digits: first a row whose "leading" matches
 * (+7 7… → KZ, +1 876… → JM), then the longest code (4 → 1) and that code's
 * first (main) row. null when nothing matches.
 */
export function detectCountryInfo(input: string): Country | null {
  const digits = String(input ?? "");
  let best: CountryRow | null = null;
  let bestLen = 0;
  for (const row of COUNTRIES) {
    const lead = row[4];
    if (!lead) continue;
    for (const l of lead) {
      const prefix = row[1] + l;
      if (prefix.length > bestLen && digits.startsWith(prefix)) {
        best = row;
        bestLen = prefix.length;
      }
    }
  }
  if (best) return toCountry(best);
  for (let len = 4; len >= 1; len--) {
    const head = digits.slice(0, len);
    if (head.length !== len) continue;
    const row = COUNTRIES.find((c) => c[1] === head && !c[4]);
    if (row) return toCountry(row);
  }
  return null;
}

/** The dialing code at the start of the digits ("998") or null — old API. */
export function detectCountry(digits: string): string | null {
  return detectCountryInfo(digits)?.dial ?? null;
}

/** ISO2 → country ("UZ" → +998). */
export function countryByIso(iso: string): Country | null {
  const up = String(iso ?? "").toUpperCase();
  const row = COUNTRIES.find((c) => c[0] === up);
  return row ? toCountry(row) : null;
}

/**
 * The default country — from the site's language (<html lang>): uz → UZ, ru → RU, en → US;
 * any other language → null (starts from "+").
 */
export function defaultCountryIso(lang?: string): string | null {
  const code = (lang ?? (typeof document !== "undefined" ? document.documentElement.lang : "") ?? "")
    .toLowerCase()
    .slice(0, 2);
  if (code === "uz") return "UZ";
  if (code === "ru") return "RU";
  if (code === "en") return "US";
  return null;
}
