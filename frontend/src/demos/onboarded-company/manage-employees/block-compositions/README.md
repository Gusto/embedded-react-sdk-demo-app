# Employee Management Block Compositions

This directory contains exploded examples showing how to compose individual SDK card and form components to build custom employee management flows.

## Overview

The Gusto Embedded React SDK provides two ways to integrate employee management features:

1. **High-level blocks** (e.g., `<EmployeeManagement.Compensation />`) - Pre-packaged components that handle internal orchestration, form swapping, and state management
2. **Individual components** (e.g., `<EmployeeManagement.CompensationCard />`, `<EmployeeManagement.CompensationEditForm />`) - Granular card and form components that give you full control over routing, layout, and flow

This demo showcases **option 2** - building custom flows by composing individual components.

## What's Included

### Block Compositions

Each composition demonstrates how to wire up a Card component with its corresponding Form components:

- **CompensationComposition** - `CompensationCard` + `CompensationEditForm` + `CompensationAddJobForm` + `CompensationAddAnotherJobForm`
- **DeductionsComposition** - `DeductionsCard` + `DeductionsEditForm`
- **PaymentMethodComposition** - `PaymentMethodCard` + `PaymentMethodBankForm` + `PaymentMethodSplitForm`
- **ProfileComposition** - `ProfileCard` + `ProfileEditForm`
- **HomeAddressComposition** - `HomeAddressCard` + `HomeAddressEditForm`
- **WorkAddressComposition** - `WorkAddressCard` + `WorkAddressEditForm`
- **FederalTaxesComposition** - `FederalTaxesCard` + `FederalTaxesEditForm`
- **StateTaxesComposition** - `StateTaxesCard` + `StateTaxesEditForm`
- **DocumentsComposition** - `DocumentsCard` + `DocumentManager`

### Demo Pages

The `/employees/:employeeId/compositions` route provides an interactive demo where you can:

- View all compositions organized by category (Basic Details, Job & Pay, Taxes, Documents)
- See how events from cards trigger navigation to forms
- Understand the routing patterns for each composition

## Key Patterns

### Event-Driven Navigation

Each Card component emits events when users interact with it. For example:

```tsx
<EmployeeManagement.CompensationCard
  employeeId={employeeId}
  onEvent={(type, payload) => {
    switch (type) {
      case componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_CARD_EDIT_REQUESTED:
        const { jobId } = payload as { jobId: string };
        navigate(`/compensation/edit/${jobId}`);
        break;
      // ... more cases
    }
  }}
/>
```

### Form Completion Handling

Form components emit `submitted` and `cancelled` events to signal when to return to the card:

```tsx
<EmployeeManagement.CompensationEditForm
  employeeId={employeeId}
  jobId={jobId}
  onEvent={(type) => {
    if (
      type === componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_EDIT_FORM_SUBMITTED ||
      type === componentEvents.EMPLOYEE_MANAGEMENT_COMPENSATION_EDIT_FORM_CANCELLED
    ) {
      navigate('/compensation'); // Return to card view
    }
  }}
/>
```

### Routing Structure

Each composition uses React Router's `<Routes>` to manage the card/form swap:

```tsx
<Routes>
  <Route index element={<CardComponent />} />
  <Route path="edit" element={<EditFormComponent />} />
  <Route path="add" element={<AddFormComponent />} />
</Routes>
```

## When to Use This Pattern

Use individual components when you need:

- **Custom routing** - Forms in modals, drawers, or different page layouts
- **Non-standard flows** - Skipping steps, conditional navigation, or multi-step wizards
- **Custom layouts** - Cards arranged differently than the standard dashboard tabs
- **Integration with your state management** - Redux, Zustand, or other state solutions

Use high-level blocks when:

- You want the standard dashboard experience out-of-the-box
- You're okay with the SDK's internal orchestration
- You want to minimize integration code

## Comparison with Employee Onboarding

This follows the same pattern as the `employee-onboarding/block-compositions/CompensationComposition.tsx` example, but applied to the employee management surface. Both demonstrate:

1. Breaking down high-level SDK blocks into individual components
2. Handling event-driven navigation between components
3. Using React Router for URL-based state
4. Proper TypeScript typing for events and payloads

## Learn More

- [SDK Documentation](https://github.com/Gusto/embedded-react-sdk/tree/main/docs/reference/employee/management)
- [Event Handling Guide](https://docs.gusto.com/embedded-payroll/docs/event-handling)
- [Employee Onboarding Composition Example](../employee-onboarding/block-compositions/CompensationComposition.tsx)
