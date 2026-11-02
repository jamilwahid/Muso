export const foodOptions = [
  { value: 'Halal Food Option Available', label: 'Halal options' },
  { value: 'Vegetarian Food Option Available', label: 'Vegetarian options' },
  { value: 'Pork-Free Menu', label: 'Pork-free menu' },
] as const;

export function matchesFoodOption(services: string[] | null | undefined, option: string): boolean {
  return !!services?.some(service =>
    service === option || (option === 'Halal Food Option Available' && service === 'Halal Centre')
  );
}
