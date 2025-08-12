/**
 * Hook para manejo de fechas y cálculos temporales
 * Contiene todas las utilidades relacionadas con fechas y días feriados
 */
export const useDateCalculations = () => {
  // Funciones helper para el manejo de fechas
  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const addMonths = (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getCurrentDate = (): Date => new Date();

  // Función para calcular días entre fechas
  const calculateDaysBetween = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays); // No permitir días negativos
  };

  // Calcular fechas base según las reglas de negocio
  const calculateDefaultDates = (diasFeriado1: number = 15, diasFeriado2: number = 15) => {
    const today = getCurrentDate();

    // Fecha Control: fecha actual - 1 mes exacto
    const fechaControl = addMonths(today, -1);

    // Fecha Ingreso: fecha control + días feriados 1
    const fechaIngreso = addDays(fechaControl, diasFeriado1);

    // Fecha Registro: fecha actual
    const fechaRegistro = today;

    return {
      fechaControl: formatDateForInput(fechaControl),
      fechaIngreso: formatDateForInput(fechaIngreso),
      fechaRegistro: formatDateForInput(fechaRegistro)
    };
  };

  // Calcular límites de fechas según las reglas
  const getDateLimits = (diasFeriado1: number = 15, diasFeriado2: number = 15) => {
    const today = getCurrentDate();

    return {
      fechaControl: {
        min: formatDateForInput(addDays(today, -60)), // 60 días antes
        max: formatDateForInput(today) // fecha actual
      },
      fechaIngreso: {
        min: formatDateForInput(addMonths(today, -1)), // 1 mes antes
        max: formatDateForInput(today) // fecha actual
      },
      fechaRegistro: {
        min: formatDateForInput(addDays(today, -diasFeriado2)), // fecha actual - días feriados 2
        max: formatDateForInput(today) // fecha actual
      }
    };
  };

  return {
    addDays,
    addMonths,
    formatDateForInput,
    getCurrentDate,
    calculateDaysBetween,
    calculateDefaultDates,
    getDateLimits
  };
};
