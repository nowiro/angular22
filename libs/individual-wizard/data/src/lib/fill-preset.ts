/**
 * Demo-data presets for the dev-fill panel. With Signal Forms, "filling the
 * form" is just building a complete model value — checksum-valid PESEL/NIP
 * included — and setting it on the store's model signal.
 */
import type { FillMode } from '@angular22/wizard-core';
import {
  emptyAddress,
  emptyPhone,
  generateValidNip,
  generateValidPesel,
  pick,
  randomCity,
  randomCompany,
  randomEmail,
  randomEmployedSince,
  randomFirstName,
  randomFlatNumber,
  randomHouseNumber,
  randomKeyword,
  randomLastName,
  randomMonthlyGross,
  randomPhoneNumber,
  randomPosition,
  randomPostalCode,
  randomStreet,
  randomThesisTopic,
  randomUniversity,
} from '@angular22/wizard-core';

import { applicableConsents } from './consents-catalog';
import type { IndividualData } from './models';
import { emptyContract, initialIndividualData } from './models';

function filledAddress(purpose: string): IndividualData['contact']['addresses'][number] {
  return {
    ...emptyAddress(purpose),
    street: randomStreet(),
    houseNumber: randomHouseNumber(),
    flatNumber: randomFlatNumber(),
    postalCode: randomPostalCode(),
    city: randomCity(),
  };
}

function filledContract(): IndividualData['survey']['employment']['details']['contracts'][number] {
  return { type: pick(['uop', 'b2b'] as const), since: randomEmployedSince(), grossMonthly: randomMonthlyGross() };
}

export function buildIndividualPreset(mode: FillMode): IndividualData {
  const birth = new Date(Date.UTC(1990, 3, 12));
  const data = initialIndividualData();

  data.basicData = {
    citizenship: 'PL',
    firstName: randomFirstName('female'),
    middleName: mode === 'required' ? '' : randomFirstName('female'),
    lastName: randomLastName(),
    pesel: generateValidPesel(birth, 'female'),
    nip: '',
    dateOfBirth: birth,
    gender: 'female',
  };

  data.contact = {
    email: randomEmail(),
    phones: [{ ...emptyPhone('mobile'), number: randomPhoneNumber() }],
    addresses: [filledAddress('residence')],
  };

  if (mode === 'all') {
    data.basicData.nip = generateValidNip();
    data.survey.educationLevel = 'higher';
    data.survey.higherEducation.university = randomUniversity();
    data.survey.higherEducation.field = 'IT';
    data.survey.higherEducation.specialisation.branch = 'frontend';
    data.survey.employment.status = 'employed';
    data.survey.employment.details = {
      companyName: randomCompany(),
      position: randomPosition(),
      contracts: [filledContract()],
    };
    data.survey.languages = [
      { code: 'pl', level: 'C2' },
      { code: 'en', level: 'B2' },
    ];
  }

  if (mode === 'max') {
    data.basicData.nip = generateValidNip();
    data.contact.phones.push({ ...emptyPhone('work'), number: randomPhoneNumber() });
    data.contact.addresses.push(filledAddress('mailing'));
    data.survey.educationLevel = 'phd';
    data.survey.higherEducation.university = randomUniversity();
    data.survey.higherEducation.field = 'IT';
    data.survey.higherEducation.specialisation.branch = pick(['data', 'security'] as const);
    data.survey.higherEducation.specialisation.thesis = {
      topic: randomThesisTopic(),
      keywords: [randomKeyword(), randomKeyword(), randomKeyword()],
    };
    data.survey.employment.status = 'self-employed';
    data.survey.employment.details = {
      companyName: randomCompany(),
      position: randomPosition(),
      contracts: [
        filledContract(),
        { ...emptyContract(), type: 'b2b', since: randomEmployedSince(), grossMonthly: randomMonthlyGross() },
      ],
    };
    data.survey.languages = [
      { code: 'pl', level: 'C2' },
      { code: 'en', level: 'C1' },
      { code: 'de', level: 'B1' },
    ];
  }

  data.meta.acceptTerms = true;
  // Consents resolved from the final shape; required always granted, optional
  // ones granted in the fuller modes.
  data.consents.items = applicableConsents(data).map((item) => ({
    ...item,
    granted: mode === 'required' ? item.required : true,
  }));

  return data;
}
