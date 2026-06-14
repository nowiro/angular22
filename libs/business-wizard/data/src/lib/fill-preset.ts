/**
 * Demo-data presets for the business wizard's dev-fill panel.
 */
import type { FillMode } from '@angular22/wizard-core';
import {
  emptyPhone,
  filledAddress,
  generateValidKrs,
  generateValidNip,
  generateValidRegon,
  grantConsents,
  pickInt,
  randomCompany,
  randomEmail,
  randomFirstName,
  randomFoundingYear,
  randomLastName,
  randomPhoneNumber,
  randomWebsiteUrl,
} from '@angular22/wizard-core';

import { applicableConsents } from './consents-catalog';
import type { BusinessData, RepresentativeValue } from './models';
import { initialBusinessData } from './models';

function filledRepresentative(role: RepresentativeValue['role']): RepresentativeValue {
  return {
    fullName: `${randomFirstName()} ${randomLastName()}`,
    role,
    email: randomEmail(),
    phone: randomPhoneNumber(),
    authorisedToSign: true,
  };
}

export function buildBusinessPreset(mode: FillMode): BusinessData {
  const data = initialBusinessData();

  data.companyBasics = {
    legalName: randomCompany(),
    tradeName: '',
    legalForm: 'limited-liability',
    nip: generateValidNip(),
    regon: generateValidRegon(),
    krs: generateValidKrs(),
    foundingYear: randomFoundingYear(),
    websiteUrl: '',
  };

  data.contact = {
    email: randomEmail(),
    phones: [{ ...emptyPhone('office'), number: randomPhoneNumber() }],
    addresses: [filledAddress('headquarters')],
  };

  data.representatives.items = [filledRepresentative('ceo')];

  if (mode === 'all') {
    data.companyBasics.tradeName = randomCompany();
    data.companyBasics.websiteUrl = randomWebsiteUrl();
    data.profile.revenueRange = '2m-10m';
    data.profile.employeeRange = '10-49';
  }

  if (mode === 'max') {
    data.companyBasics.tradeName = randomCompany();
    data.companyBasics.websiteUrl = randomWebsiteUrl();
    data.contact.phones.push({
      ...emptyPhone('mobile'),
      number: randomPhoneNumber(),
      extension: String(pickInt(10, 99)),
    });
    data.contact.addresses.push(filledAddress('branch'));
    // Finance + B2C + export forces the maximum consent load (PSD2, B2C
    // notice, sanctions oath).
    data.profile.industry = 'finance';
    data.profile.customerSegment = 'b2b-b2c';
    data.profile.hasExport = true;
    data.profile.revenueRange = '50m-200m';
    data.profile.employeeRange = '250-999';
    data.profile.workingLanguages = [
      { code: 'pl', level: 'C2' },
      { code: 'en', level: 'C1' },
      { code: 'de', level: 'B2' },
    ];
    data.representatives.items.push(filledRepresentative('cfo'));
  }

  data.meta.acceptTerms = true;
  data.consents.items = grantConsents(applicableConsents(data), mode);

  return data;
}
