/**
 * Pure relevance predicates for the wizard's conditional branches. The same
 * functions drive schema gating (`applyWhen` / `hidden`) and template `@if`s,
 * so validation and rendering can never drift apart.
 */
import { THESIS_BRANCHES } from './dictionaries';
import type { EducationLevel, EmploymentStatus, IndividualData, ItBranch, StudyField } from './models';

export function showsHigherEducation(level: EducationLevel): boolean {
  return level === 'higher' || level === 'phd';
}

export function showsSpecialisation(level: EducationLevel, field: StudyField): boolean {
  return showsHigherEducation(level) && field === 'IT';
}

export function showsThesis(level: EducationLevel, field: StudyField, branch: ItBranch): boolean {
  return level === 'phd' && field === 'IT' && THESIS_BRANCHES.has(branch);
}

export function showsEmploymentDetails(status: EmploymentStatus): boolean {
  return status === 'employed' || status === 'self-employed';
}

/** Convenience bundle computed from a full model snapshot. */
export function relevanceOf(data: IndividualData): {
  higherEducation: boolean;
  specialisation: boolean;
  thesis: boolean;
  employmentDetails: boolean;
} {
  const { educationLevel, higherEducation, employment } = data.survey;
  return {
    higherEducation: showsHigherEducation(educationLevel),
    specialisation: showsSpecialisation(educationLevel, higherEducation.field),
    thesis: showsThesis(educationLevel, higherEducation.field, higherEducation.specialisation.branch),
    employmentDetails: showsEmploymentDetails(employment.status),
  };
}
