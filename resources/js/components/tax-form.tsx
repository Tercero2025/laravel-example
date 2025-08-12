"use client"

import { useState, useEffect } from "react"
import { TregsellosFormData, Tregsellos, TaxFormMode, SqlDatos } from "@/types/tregsellos"
import {
  formDataToTregsellos,
  tregsellosToFormData,
  calculateTotals
} from "@/utils/tregsellosUtils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Swal from 'sweetalert2';
import { Textarea } from "@/components/ui/textarea"
import { InputDate } from "@/components/ui/input-date"
import { ArrowRight } from "lucide-react"

// Importar hooks personalizados
import { useNumericValidation } from '@/hooks/useNumericValidation';
import { useDateCalculations } from '@/hooks/useDateCalculations';
import { useTaxFormValidation } from '@/hooks/useTaxFormValidation';
import { useTaxFormApi } from '@/hooks/useTaxFormApi';

// Importar componentes especializados
import { NumericInput } from '@/components/TaxForm/NumericInput';
import { ClientSelect } from '@/components/TaxForm/ClientSelect';

interface TaxFormProps {
  initialData?: Tregsellos;
  mode?: TaxFormMode;
  onSubmit?: (data: Partial<Tregsellos>) => void;
  onCancel?: () => void;
}

export default function TaxForm({
  initialData,
  mode = 'create',
  onSubmit,
  onCancel
}: TaxFormProps) {

  // Constante para el ancho de los inputs de valores
  const widthInputs = "w-36";

  // Hooks personalizados
  const { validateNumericInput } = useNumericValidation();
  const { 
    addDays, 
    addMonths, 
    formatDateForInput, 
    getCurrentDate, 
    calculateDaysBetween, 
    calculateDefaultDates, 
    getDateLimits 
  } = useDateCalculations();
  const { validateFormData } = useTaxFormValidation();
  const { 
    sqlDatos, 
    monedas, 
    clientes, 
    productos, 
    isLoading
  } = useTaxFormApi();

  // Función para copiar valores de Base Imponible a Valor Registro
  const copyBaseToRegister = () => {
    setFormData(prev => ({
      ...prev,
      valorOperativo2: prev.valorOperativo1,
      sumaFija2: prev.sumaFija1
    }));
  };

  const getEmptyData = (datos?: SqlDatos): TregsellosFormData => {
    const diasFeriado1 = parseInt(datos?.FERIADO1 || "15");
    const diasFeriado2 = parseInt(datos?.FERIADO2 || "15");
    const defaultDates = calculateDefaultDates(diasFeriado1, diasFeriado2);

    return {
      acto: datos?.ACTO || "Agenda | 01",
      fechaControl: defaultDates.fechaControl,
      diasFeriadoHeader: datos?.FERIADO1 || "15",
      comprador: "",
      fechaIngreso: defaultDates.fechaIngreso,
      diasFeriadoRol1: datos?.FERIADO2 || "15",
      vendedor: "",
      fechaRegistro: defaultDates.fechaRegistro,
      diasFeriadoRol2: datos?.FERIADO2 || "15",
      moneda: "Pesos",
      producto: "Ninguno",
      numeroContrato: "0",
      iva1: datos?.IVA1 || "10.50",
      iva2: datos?.IVA2 || "10.50",
      pesoProd: "0.00",
      precioProd: "0.00",
      noTomaEnCuenta: false,
      valorOperativo1: "0.00",
      sumaFija1: "0.00",
      iva1Calc: "0.00",
      baseImponible: "0.00",
      valorOperativo2: "0.00",
      sumaFija2: "0.00",
      iva2Calc: "0.00",
      valorReg: "0.00",
      importeSellado: "0.00",
      derechoReg: "0.00",
      bonificacion: datos?.BONIFICACION || "0.00",
      totalSellado: "0.00",
      observaciones: "",
    };
  };

  // Inicializar datos según el modo
  const [formData, setFormData] = useState<TregsellosFormData>(() => {
    if (mode === 'update' && initialData) {
      return tregsellosToFormData(initialData);
    } else {
      return getEmptyData();
    }
  });

  // Estado para los CUITs seleccionados
  const [compradorCuit, setCompradorCuit] = useState<string>('33711316839');
  const [vendedorCuit, setVendedorCuit] = useState<string>('33711316839');

  // Estado para controlar si el select de productos está habilitado
  const [isProductSelectEnabled, setIsProductSelectEnabled] = useState<boolean>(false);

  // Estado para controlar si el formulario es válido
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Obtener datos de configuración basados en el ACTO seleccionado
  const getCurrentSqlDatos = () => {
    return sqlDatos.find(dato => dato.ACTO === formData.acto) || {
      ACTO: '',
      CODIGO: '',
      DESCRIPCION: '',
      USAPRODUCTO: 0,
      IVA1: '10.50',
      IVA2: '10.50',
      IMPOSELLADO: '1.05',
      DERREGISTRO: '0.25',
      BONIFICACION: '0.00',
      FERIADO1: '15',
      FERIADO2: '15'
    };
  };

  // Auto-calculate totals when relevant fields change
  useEffect(() => {
    const calculations = calculateTotals(formData, currentDatos);
    setFormData(prev => ({ ...prev, ...calculations }));
  }, [
    formData.valorOperativo1,
    formData.valorOperativo2,
    formData.sumaFija1,
    formData.sumaFija2,
    formData.iva1,
    formData.iva2,
    formData.noTomaEnCuenta,
    formData.bonificacion,
    formData.acto // Para recalcular cuando cambien los porcentajes
  ]);

  // Validar formulario cada vez que cambien los datos relevantes
  useEffect(() => {
    const isValid = validateFormData(formData);
    setIsFormValid(isValid);
  }, [
    formData.comprador,
    formData.vendedor,
    formData.fechaControl,
    formData.fechaIngreso,
    formData.fechaRegistro,
    formData.diasFeriadoHeader,
    formData.diasFeriadoRol1,
    formData.numeroContrato,
    formData.totalSellado,
    formData.importeSellado,
    formData.derechoReg
  ]);

  const handleInputChange = (field: keyof TregsellosFormData, value: string | boolean) => {
    // Manejar cambios especiales para los combos de clientes
    if (field === 'comprador' || field === 'vendedor') {
      if (typeof value === 'string') {
        // Extraer el CUIT del valor seleccionado (formato: "RAZON SOCIAL | CUIT")
        const parts = value.split(' | ');
        const cuit = parts.length > 1 ? parts[1] : '33711316839';

        if (field === 'comprador') {
          setCompradorCuit(cuit);
        } else if (field === 'vendedor') {
          setVendedorCuit(cuit);
        }
      }
    }

    // Validar inputs numéricos
    if (typeof value === 'string' && [
      'diasFeriadoHeader', 'diasFeriadoRol1', 'diasFeriadoRol2',
      'iva1', 'iva2', 'numeroContrato', 'pesoProd', 'precioProd',
      'valorOperativo1', 'valorOperativo2', 'sumaFija1', 'sumaFija2',
      'bonificacion'
    ].includes(field as string)) {
      value = validateNumericInput(value, field);
    }

    // Validaciones especiales para fechas
    if (typeof value === 'string' && (field === 'fechaControl' || field === 'fechaIngreso' || field === 'fechaRegistro')) {
      const inputDate = new Date(value);
      const today = getCurrentDate();
      const diasFeriado1 = parseInt(formData.diasFeriadoHeader) || 15;
      const diasFeriado2 = parseInt(formData.diasFeriadoRol1) || 15;
      const limits = getDateLimits(diasFeriado1, diasFeriado2);

      let adjustedValue = value;

      // Validar límites según el campo
      switch (field) {
        case 'fechaControl':
          const minControl = new Date(limits.fechaControl.min);
          const maxControl = new Date(limits.fechaControl.max);
          if (inputDate < minControl) adjustedValue = limits.fechaControl.min;
          if (inputDate > maxControl) adjustedValue = limits.fechaControl.max;
          break;

        case 'fechaIngreso':
          const minIngreso = new Date(limits.fechaIngreso.min);
          const maxIngreso = new Date(limits.fechaIngreso.max);
          if (inputDate < minIngreso) adjustedValue = limits.fechaIngreso.min;
          if (inputDate > maxIngreso) adjustedValue = limits.fechaIngreso.max;
          break;

        case 'fechaRegistro':
          const minRegistro = new Date(limits.fechaRegistro.min);
          const maxRegistro = new Date(limits.fechaRegistro.max);
          if (inputDate < minRegistro) adjustedValue = limits.fechaRegistro.min;
          if (inputDate > maxRegistro) adjustedValue = limits.fechaRegistro.max;
          break;
      }

      // Calcular automáticamente los días feriados basados en las fechas
      setFormData((prev) => {
        const newData = { ...prev, [field]: adjustedValue };
        
        // Calcular días feriados según el campo que cambió
        if (field === 'fechaControl' && newData.fechaIngreso) {
          const newDiasFeriado1 = calculateDaysBetween(adjustedValue, newData.fechaIngreso);
          newData.diasFeriadoHeader = newDiasFeriado1.toString();
        } else if (field === 'fechaIngreso') {
          // Cambio en fecha de ingreso afecta ambos días feriados
          if (newData.fechaControl) {
            const newDiasFeriado1 = calculateDaysBetween(newData.fechaControl, adjustedValue);
            newData.diasFeriadoHeader = newDiasFeriado1.toString();
          }
          if (newData.fechaRegistro) {
            const newDiasFeriado2 = calculateDaysBetween(adjustedValue, newData.fechaRegistro);
            newData.diasFeriadoRol1 = newDiasFeriado2.toString();
            newData.diasFeriadoRol2 = newDiasFeriado2.toString();
          }
        } else if (field === 'fechaRegistro' && newData.fechaIngreso) {
          const newDiasFeriado2 = calculateDaysBetween(newData.fechaIngreso, adjustedValue);
          newData.diasFeriadoRol1 = newDiasFeriado2.toString();
          newData.diasFeriadoRol2 = newDiasFeriado2.toString();
        }

        return newData;
      });
    } else if (typeof value === 'string' && (field === 'diasFeriadoHeader' || field === 'diasFeriadoRol1' || field === 'diasFeriadoRol2')) {
      // Manejar cambios en días feriados y actualizar fechas correspondientes
      setFormData((prev) => {
        const newData = { ...prev, [field]: value };
        const diasValue = parseInt(value) || 0;

        if (field === 'diasFeriadoHeader' && newData.fechaControl) {
          // Cambio en días feriados 1: actualizar fecha de ingreso
          const fechaControl = new Date(newData.fechaControl);
          const nuevaFechaIngreso = addDays(fechaControl, diasValue);
          
          // Validar que la nueva fecha de ingreso esté dentro de los límites
          const limits = getDateLimits(diasValue, parseInt(newData.diasFeriadoRol1) || 15);
          const minIngreso = new Date(limits.fechaIngreso.min);
          const maxIngreso = new Date(limits.fechaIngreso.max);
          
          let fechaIngresoValidada = nuevaFechaIngreso;
          if (nuevaFechaIngreso < minIngreso) {
            fechaIngresoValidada = minIngreso;
            // Recalcular días feriados basado en la fecha validada
            const diasRecalculados = calculateDaysBetween(newData.fechaControl, formatDateForInput(fechaIngresoValidada));
            newData.diasFeriadoHeader = diasRecalculados.toString();
          } else if (nuevaFechaIngreso > maxIngreso) {
            fechaIngresoValidada = maxIngreso;
            // Recalcular días feriados basado en la fecha validada
            const diasRecalculados = calculateDaysBetween(newData.fechaControl, formatDateForInput(fechaIngresoValidada));
            newData.diasFeriadoHeader = diasRecalculados.toString();
          }
          
          newData.fechaIngreso = formatDateForInput(fechaIngresoValidada);
          
          // También actualizar días feriados 2 si hay fecha de registro
          if (newData.fechaRegistro) {
            const newDiasFeriado2 = calculateDaysBetween(newData.fechaIngreso, newData.fechaRegistro);
            newData.diasFeriadoRol1 = newDiasFeriado2.toString();
            newData.diasFeriadoRol2 = newDiasFeriado2.toString();
          }
        } else if ((field === 'diasFeriadoRol1' || field === 'diasFeriadoRol2') && newData.fechaIngreso) {
          // Cambio en días feriados 2: actualizar fecha de registro
          const fechaIngreso = new Date(newData.fechaIngreso);
          const nuevaFechaRegistro = addDays(fechaIngreso, diasValue);
          
          // Validar que la nueva fecha de registro esté dentro de los límites
          const limits = getDateLimits(parseInt(newData.diasFeriadoHeader) || 15, diasValue);
          const minRegistro = new Date(limits.fechaRegistro.min);
          const maxRegistro = new Date(limits.fechaRegistro.max);
          
          let fechaRegistroValidada = nuevaFechaRegistro;
          if (nuevaFechaRegistro < minRegistro) {
            fechaRegistroValidada = minRegistro;
            // Recalcular días feriados basado en la fecha validada
            const diasRecalculados = calculateDaysBetween(newData.fechaIngreso, formatDateForInput(fechaRegistroValidada));
            newData.diasFeriadoRol1 = diasRecalculados.toString();
            newData.diasFeriadoRol2 = diasRecalculados.toString();
          } else if (nuevaFechaRegistro > maxRegistro) {
            fechaRegistroValidada = maxRegistro;
            // Recalcular días feriados basado en la fecha validada
            const diasRecalculados = calculateDaysBetween(newData.fechaIngreso, formatDateForInput(fechaRegistroValidada));
            newData.diasFeriadoRol1 = diasRecalculados.toString();
            newData.diasFeriadoRol2 = diasRecalculados.toString();
          }
          
          newData.fechaRegistro = formatDateForInput(fechaRegistroValidada);
          
          // Sincronizar ambos campos de días feriados 2
          newData.diasFeriadoRol1 = newData.diasFeriadoRol1; // Ya establecido arriba
          newData.diasFeriadoRol2 = newData.diasFeriadoRol2; // Ya establecido arriba
        }

        return newData;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Efecto para actualizar fechas cuando cambian los días feriados (solo en inicialización)
  useEffect(() => {
    if (!initialData && mode === 'create') {
      // Solo ejecutar durante la inicialización para establecer valores por defecto
      const diasFeriado1 = parseInt(formData.diasFeriadoHeader) || 15;
      const diasFeriado2 = parseInt(formData.diasFeriadoRol1) || 15;

      // Solo recalcular si estamos en valores por defecto (cuando las fechas coinciden con los cálculos iniciales)
      const today = getCurrentDate();
      const defaultControlDate = formatDateForInput(addMonths(today, -1));
      
      if (formData.fechaControl === defaultControlDate) {
        const fechaControl = new Date(formData.fechaControl);
        const nuevaFechaIngreso = addDays(fechaControl, diasFeriado1);
        const nuevaFechaRegistro = addDays(nuevaFechaIngreso, diasFeriado2);

        setFormData(prev => ({
          ...prev,
          fechaIngreso: formatDateForInput(nuevaFechaIngreso),
          fechaRegistro: formatDateForInput(nuevaFechaRegistro)
        }));
      }
    }
  }, [formData.diasFeriadoHeader, formData.diasFeriadoRol1, formData.diasFeriadoRol2, initialData, mode]);

  // Efecto simplificado para la fecha de control (solo durante inicialización)
  useEffect(() => {
    if (!initialData && mode === 'create' && formData.fechaControl) {
      // Solo si estamos en modo creación y es la inicialización
      const today = getCurrentDate();
      const defaultControlDate = formatDateForInput(addMonths(today, -1));
      
      if (formData.fechaControl === defaultControlDate) {
        const diasFeriado1 = parseInt(formData.diasFeriadoHeader) || 15;
        const diasFeriado2 = parseInt(formData.diasFeriadoRol1) || 15;
        const fechaControl = new Date(formData.fechaControl);
        const nuevaFechaIngreso = addDays(fechaControl, diasFeriado1);
        const nuevaFechaRegistro = addDays(nuevaFechaIngreso, diasFeriado2);

        setFormData(prev => ({
          ...prev,
          fechaIngreso: formatDateForInput(nuevaFechaIngreso),
          fechaRegistro: formatDateForInput(nuevaFechaRegistro)
        }));
      }
    }
  }, [formData.fechaControl, initialData, mode]);

  // Efecto para actualizar valores cuando cambia el ACTO seleccionado
  useEffect(() => {
    if (formData.acto && sqlDatos.length > 0) {
      const selectedDato = sqlDatos.find(dato => dato.ACTO === formData.acto);
      if (selectedDato) {
        // Actualizar los valores con los de la configuración seleccionada
        const diasFeriado1 = parseInt(selectedDato.FERIADO1) || 15;
        const diasFeriado2 = parseInt(selectedDato.FERIADO2) || 15;
        const defaultDates = calculateDefaultDates(diasFeriado1, diasFeriado2);

        // Controlar el estado del select de productos según USAPRODUCTO
        const productSelectEnabled = selectedDato.USAPRODUCTO === 1;
        setIsProductSelectEnabled(productSelectEnabled);

        setFormData(prev => ({
          ...prev,
          iva1: selectedDato.IVA1,
          iva2: selectedDato.IVA2,
          diasFeriadoHeader: selectedDato.FERIADO1,
          diasFeriadoRol1: selectedDato.FERIADO2,
          diasFeriadoRol2: selectedDato.FERIADO2,
          bonificacion: selectedDato.BONIFICACION,
          // Si el select de productos se deshabilita, establecer "Ninguno"
          producto: productSelectEnabled ? prev.producto : "Ninguno",
          // Actualizar fechas solo si no están ya establecidas manualmente
          ...(prev.fechaControl === formatDateForInput(addMonths(getCurrentDate(), -1)) && {
            fechaControl: defaultDates.fechaControl,
            fechaIngreso: defaultDates.fechaIngreso,
            fechaRegistro: defaultDates.fechaRegistro
          })
        }));
      }
    }
  }, [formData.acto, sqlDatos]);

  const currentDatos = getCurrentSqlDatos();

  // Obtener límites de fechas basados en los días feriados actuales
  const diasFeriado1 = parseInt(formData.diasFeriadoHeader) || 15;
  const diasFeriado2 = parseInt(formData.diasFeriadoRol1) || 15;
  const dateLimits = getDateLimits(diasFeriado1, diasFeriado2);

  // Determinar si los campos están habilitados según el modo
  const isFieldEnabled = true;
  const showSubmitButtons = true;

  // Obtener título y descripción según el modo
  const getModeInfo = () => {
    switch (mode) {
      case 'create':
        return {
          title: 'Nuevo Registro de Sellado',
          description: 'Crear un nuevo registro de sellado',
          buttonText: 'Agregar'
        };
      case 'update':
        return {
          title: 'Actualizar Registro de Sellado',
          description: 'Modificar registro existente',
          buttonText: 'Actualizar'
        };
      default:
        return {
          title: 'Formulario de Sellados',
          description: '',
          buttonText: 'Aceptar'
        };
    }
  };

  const modeInfo = getModeInfo();

  // Función para insertar un nuevo registro de sellado
  const insertTregsellos = async (compradorCuit: string, vendedorCuit: string) => {
    try {
      // Extraer datos de comprador y vendedor
      const compradorParts = formData.comprador.split(' | ');
      const vendedorParts = formData.vendedor.split(' | ');
      
      const compradorNombre = compradorParts.length > 1 ? compradorParts[0] : '';
      const vendedorNombre = vendedorParts.length > 1 ? vendedorParts[0] : '';

      // Obtener datos de datosente para el comprador (incluye código de partido y número de registro)
      const obtenerDatosenteCliente = async (cuit: string) => {
        try {
          const response = await fetch(`/api/datosente/${cuit}`);
          if (response.ok) {
            const data = await response.json();
            return data.data;
          }
        } catch (error) {
          console.warn(`No se pudieron obtener los datos de datosente para CUIT ${cuit}`);
        }
        return null;
      };

      // Obtener dirección de los clientes del modelo Clients
      const obtenerDireccionCliente = async (cuit: string) => {
        try {
          const response = await fetch(`/api/clients/${cuit}`);
          if (response.ok) {
            const data = await response.json();
            return data.data?.domicilio || '';
          }
        } catch (error) {
          console.warn(`No se pudo obtener la dirección para CUIT ${cuit}`);
        }
        return '';
      };

      // Obtener datos del comprador (esto incluirá sellosig, presentacionsig y codpartido)
      const datosComprador = await obtenerDatosenteCliente(compradorCuit);
      const datosVendedor = await obtenerDatosenteCliente(vendedorCuit);

      // Si no se pudieron obtener los datos de datosente, usar valores por defecto
      if (!datosComprador) {
        throw new Error(`No se pudieron obtener los datos de datosente para el comprador con CUIT ${compradorCuit}`);
      }

      const dirComprador = await obtenerDireccionCliente(compradorCuit);
      const dirVendedor = await obtenerDireccionCliente(vendedorCuit);

      // Extraer código del acto (últimos 2 caracteres)
      const actoCompleto = formData.acto; // "Agenda | 01"
      const codigoActo = actoCompleto.substring(actoCompleto.length - 2);
      const nombreActo = actoCompleto.substring(0, actoCompleto.length - 3); // Sin " | XX"

      // Obtener código de moneda (índice + 1)
      const monedaIndex = monedas.findIndex(m => m.value === formData.moneda);
      const codigoMoneda = (monedaIndex >= 0 ? monedaIndex + 1 : 1);

      // Obtener código de producto (si aplica)
      const obtenerCodigoProducto = (nombreProducto: string) => {
        const producto = productos.find(p => p.value === nombreProducto);
        return producto?.codigo?.toString() || '0';
      };

      const codigoProducto = obtenerCodigoProducto(formData.producto);

      // Formatear valores numéricos
      const formatearNumero = (valor: string) => {
        return parseFloat(valor || '0');
      };

      // Obtener código de relación de acto
      const obtenerCodActoRel = (codigoActo: string) => {
        // Esta función debería buscar en la tabla tactorelacion
        // Por ahora devuelvo un valor por defecto
        return '1';
      };

      // Preparar datos para el insert (usando los datos obtenidos de datosente)
      const tregsellosData = {
        // Nota: El número de registro y código de partido se obtendrán en el backend con bloqueo
        CuitComprador: compradorCuit, // Enviamos el CUIT para que el backend obtenga los datos
        CuitVendedor: vendedorCuit,   // Enviamos el CUIT para que el backend obtenga los datos
        Contrato: parseInt(formData.numeroContrato.trim()) || null,
        Tipo: codigoActo,
        Comprador: compradorNombre,
        CuitComp: compradorCuit,
        DirComp: dirComprador,
        Vendedor: vendedorNombre,
        CuitVend: vendedorCuit,
        DirVend: dirVendedor,
        FContrato: formData.fechaControl,
        FIngreso: formData.fechaIngreso,
        FRegistro: formData.fechaRegistro,
        Feriado1: parseInt(formData.diasFeriadoHeader) || 0,
        Feriado2: parseInt(formData.diasFeriadoRol1) || 0,
        Producto: formData.producto,
        PesoNeto: formatearNumero(formData.pesoProd),
        PrecioUnit: formatearNumero(formData.precioProd),
        ValorOp1: formatearNumero(formData.valorOperativo1),
        ValorOp2: formatearNumero(formData.valorOperativo2),
        SumaFija1: formatearNumero(formData.sumaFija1),
        SumaFija2: formatearNumero(formData.sumaFija2),
        Iva1: formatearNumero(formData.iva1),
        Iva2: formatearNumero(formData.iva2),
        BaseImpon: formatearNumero(formData.baseImponible),
        ValorReg: formatearNumero(formData.valorReg),
        ImpSel: formatearNumero(formData.importeSellado),
        DerReg: formatearNumero(formData.derechoReg),
        Bonif: formatearNumero(formData.bonificacion),
        Importe: formatearNumero(formData.totalSellado),
        Exportado: formData.noTomaEnCuenta,
        Alicuota1: formatearNumero(formData.iva1Calc) / 10,
        Alicuota2: formatearNumero(formData.iva2Calc) / 10,
        Subtipo: '00',
        OtroAc: `DerReg ${currentDatos.DERREGISTRO} // IVA1 ${currentDatos.IVA1} // IVA2 ${currentDatos.IVA2}`,
        Moneda: codigoMoneda,
        NomAct: nombreActo,
        NomSub: formData.producto,
        Tipograno: codigoProducto,
        Relroles: obtenerCodActoRel(codigoActo),
        RolCont: '2',
        Operacion: monedaIndex.toString(),
        TMoneda: monedas.find(m => m.value === formData.moneda)?.tipomoneda || 'PE',
        nropresentacion: 0, // Inicializar en 0 para nuevos registros
        estado: 'A',
        Observaciones: formData.observaciones.trim()
      };

      console.log('Datos a enviar:', tregsellosData);

      // Enviar datos al backend (el backend manejará el bloqueo y la obtención del número de registro)
      const response = await fetch('/tregsellos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(tregsellosData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Registro de sellado creado exitosamente:', result);
        return result;
      } else {
        const error = await response.json();
        console.error('Error al crear registro de sellado:', error);
        throw new Error(error.message || 'Error al crear el registro');
      }
    } catch (error) {
      console.error('Error en insertTregsellos:', error);
      throw error;
    }
  };

  // ********************************************
  // Función para resetear formulario para nueva carga
  // ********************************************
  const resetFormForNewEntry = () => {
    const currentDatos = getCurrentSqlDatos();
    
    setFormData(prev => ({
      ...prev,
      // Valores base a cero (equivalente al código C#)
      numeroContrato: "0",
      valorOperativo1: "0.00",
      sumaFija1: "0.00",
      valorOperativo2: "0.00",
      sumaFija2: "0.00",
      bonificacion: currentDatos.BONIFICACION || "0.00",
      observaciones: "",
      // También resetear valores calculados
      pesoProd: "0.00",
      precioProd: "0.00",
      iva1Calc: "0.00",
      baseImponible: "0.00",
      iva2Calc: "0.00",
      valorReg: "0.00",
      importeSellado: "0.00",
      derechoReg: "0.00",
      totalSellado: "0.00",
      // Mantener las fechas y otros valores importantes
      // Mantener: acto, comprador, vendedor, moneda, producto, fechas, etc.
    }));
  };

  // ********************************************
  // Función para manejar el envío del formulario
  // ********************************************
  const handleSubmit = async (action: "accept" | "cancel") => {
    if (action === "accept") {
      if (mode === 'create') {
        try {
          // Extraer CUITs del formData
          const compradorParts = formData.comprador.split(' | ');
          const vendedorParts = formData.vendedor.split(' | ');
          
          const compradorCuit = compradorParts.length > 1 ? compradorParts[1] : '';
          const vendedorCuit = vendedorParts.length > 1 ? vendedorParts[1] : '';

          if (!compradorCuit || !vendedorCuit) {
            throw new Error('Error: No se pudieron obtener los CUITs del comprador y vendedor');
          }
          
          // Llamar a la función de inserción con los CUITs
          await insertTregsellos(compradorCuit, vendedorCuit);

          console.log('Formulario creado exitosamente');
          
          // Preguntar si quiere seguir cargando sellos usando SweetAlert2 (equivalente al MessageBox de C#)
          Swal.fire({
            title: '¡Registro creado exitosamente!',
            text: '¿Desea seguir ingresando nuevas liquidaciones?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'No, cerrar',
            backdrop: 'rgba(0,0,0,0.7)',
            customClass: {
              confirmButton: 'swal2-confirm-custom',
              popup: 'swal2-popup-custom',
              cancelButton: 'swal2-cancel-custom',
            }
          }).then((result) => {
            if (result.isConfirmed) {
              // Resetear el formulario para nueva entrada
              resetFormForNewEntry();
              // El formulario se mantiene abierto para nueva carga
              console.log('Formulario reseteado para nueva entrada');
            } else {
              // Cerrar el formulario (llamar onSubmit para que el componente padre maneje el cierre)
              onSubmit?.(formDataToTregsellos(formData));
            }
          });
        } catch (error) {
          console.error('Error al crear el registro:', error);
          // Mostrar mensaje de error usando SweetAlert2
          Swal.fire({
            title: 'Error',
            text: 'Error al crear el registro. Por favor, inténtalo de nuevo.',
            icon: 'error',
            customClass: {
              popup: 'swal2-popup-custom'
            }
          });
        }
      } else {
        // Modo actualización - usar la función original
        const tregsellosData = formDataToTregsellos(formData);
        console.log('Formulario actualizado:', tregsellosData);
        onSubmit?.(tregsellosData);
      }
    } else {
      console.log("Formulario cancelado");
      onCancel?.();
    }
  };

  return (
    <div className="mx-auto mt-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 shadow-lg min-w-[1140px] max-w-[1140px]">
      {/* Mode Header */}
      <div className={`p-3 border-b border-gray-300 dark:border-gray-600 ${
        mode === 'create' ? 'bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-600' :
          'bg-yellow-100 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-600'
        }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">{modeInfo.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{modeInfo.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
              mode === 'create' ? 'bg-green-500 text-white dark:bg-green-600' :
                'bg-yellow-500 text-white dark:bg-yellow-600'
              }`}>
              {mode}
            </span>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* ROL Sections */}
        <div className="grid grid-rows-[70px-1fr] gap-4 border-t border-l border-b-2 border-r-2 border-gray-400 p-2 bg-gray-50 dark:bg-gray-800">
          {/* First Row: ACTO */}
          <div className="gap-2 px-2 border-b border-gray-300 dark:border-gray-600">
            <div className="flex items-center justify-center gap-2 min-w-0">
              <Label className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap flex-shrink-0 w-10">ACTO</Label>
              <Select value={formData.acto} onValueChange={(value) => handleInputChange("acto", value)} disabled={!isFieldEnabled || isLoading}>
                <SelectTrigger className="border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 text-xs min-w-0 flex-1 h-7">
                  <SelectValue placeholder={isLoading ? "Cargando..." : "Seleccionar ACTO"} />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {sqlDatos.map((dato, index) => (
                    <SelectItem key={index} value={dato.ACTO} className="text-xs">
                      {dato.ACTO}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* ROL 1 */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-[3rem_1fr] gap-2 items-center mb-1">
              <div className="font-semibold text-gray-700 dark:text-gray-300 flex items-center h-7">ROL 1</div>
              <ClientSelect
                label="COMPRADOR"
                value={formData.comprador}
                onChange={(value) => handleInputChange("comprador", value)}
                options={clientes}
                disabled={!isFieldEnabled || isLoading}
                isLoading={isLoading}
              />
            </div>
            <div className="mt-3 text-base text-center text-gray-600 dark:text-gray-400">
              CUIT N°: {compradorCuit}
            </div>
          </div>

          {/* ROL 2 */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-[3rem_1fr] gap-2 items-center mb-1">
              <div className="font-semibold text-gray-700 dark:text-gray-300 flex items-center h-7">ROL 2</div>
              <ClientSelect
                label="VENDEDOR"
                value={formData.vendedor}
                onChange={(value) => handleInputChange("vendedor", value)}
                options={clientes}
                disabled={!isFieldEnabled || isLoading}
                isLoading={isLoading}
              />
            </div>
            <div className="mt-3 text-base text-center text-gray-600 dark:text-gray-400">
              CUIT N°: {vendedorCuit}
            </div>
            {/* Contract and Product Section */}
          </div>
          <div className="p-2">
            <div className="grid grid-cols-2 gap-4 items-center text-xs mb-2">
              <div className="flex items-center gap-2">
                <Label className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">MONEDA</Label>
                <Select value={formData.moneda} onValueChange={(value) => handleInputChange("moneda", value)} disabled={!isFieldEnabled || isLoading}>
                  <SelectTrigger className="border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 text-xs min-w-0 flex-1 h-7">
                    <SelectValue placeholder={isLoading ? "Cargando..." : "Seleccionar moneda"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {monedas.map((moneda, index) => (
                      <SelectItem key={index} value={moneda.value} className="text-xs">
                        {moneda.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">PRODUCTO</Label>
                <Select value={formData.producto} onValueChange={(value) => handleInputChange("producto", value)} disabled={!isFieldEnabled || !isProductSelectEnabled || isLoading}>
                  <SelectTrigger className={`${
                    isLoading 
                      ? "border border-gray-400 dark:border-gray-600" 
                      : isProductSelectEnabled 
                        ? "border-2 border-green-500 dark:border-green-400" 
                        : "border-2 border-red-500 dark:border-red-400"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 text-xs min-w-0 flex-1 h-7`}>
                    <SelectValue placeholder={isLoading ? "Cargando..." : (!isProductSelectEnabled ? "Producto no disponible" : "Seleccionar producto")} />
                  </SelectTrigger>
                  <SelectContent>
                    {productos.map((producto, index) => (
                      <SelectItem key={index} value={producto.value}>
                        {producto.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center text-xs">
              <NumericInput
                label="PESO PROD."
                value={formData.pesoProd}
                onChange={(field, value) => handleInputChange(field, value)}
                disabled={!isFieldEnabled}
                field="pesoProd"
                className="text-right"
              />
              <NumericInput
                label="PRECIO PROD."
                value={formData.precioProd}
                onChange={(field, value) => handleInputChange(field, value)}
                disabled={!isFieldEnabled}
                field="precioProd"
                className="text-right"
              />
            </div>
          </div>
        </div>
        {/* Right Section: Product and Details */}
        <div className="border-t border-l border-b-2 border-r-2 border-gray-400 p-2 bg-gray-50 dark:bg-gray-800">
          {/* Información sobre el comportamiento de fechas */}
          <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs">
            <div className="font-semibold text-blue-800 dark:text-blue-200 mb-1">📅 Comportamiento Automático de Fechas:</div>
            <div className="text-blue-700 dark:text-blue-300 space-y-1">
              <div>• <strong>Fecha Control:</strong> Por defecto 1 mes antes de hoy (rango: 60 días antes a hoy)</div>
              <div>• <strong>Fecha Ingreso:</strong> Se calcula automáticamente como Fecha Control + Días Feriados 1 (debe coincidir exactamente)</div>
              <div>• <strong>Fecha Registro:</strong> Se calcula automáticamente como Fecha Ingreso + Días Feriados 2 (debe coincidir exactamente)</div>
              <div>• <strong>Validación:</strong> La diferencia entre fechas debe ser exactamente igual a los días feriados correspondientes</div>
            </div>
          </div>

          {/* Second Row: Dates and DIAS FERIADO */}
          <div >
            <div className="grid grid-cols-[300px_200px] gap-4">
              { /* DIAS */}
              <div className="flex flex-col gap-2">
                <InputDate
                  label="FECHA CONTROL"
                  value={formData.fechaControl}
                  onChange={(value) => handleInputChange("fechaControl", value)}
                  disabled={!isFieldEnabled}
                  min={dateLimits.fechaControl.min}
                  max={dateLimits.fechaControl.max}
                  title={`Rango: desde ${dateLimits.fechaControl.min} hasta ${dateLimits.fechaControl.max}`}
                  labelClassName="w-40 pl-3"
                />
                <InputDate
                  label="FECHA INGRESO"
                  value={formData.fechaIngreso}
                  onChange={(value) => handleInputChange("fechaIngreso", value)}
                  disabled={!isFieldEnabled}
                  min={dateLimits.fechaIngreso.min}
                  max={dateLimits.fechaIngreso.max}
                  title={`Rango: desde ${dateLimits.fechaIngreso.min} hasta ${dateLimits.fechaIngreso.max}`}
                  labelClassName="w-40 pl-3"
                />
                <InputDate
                  label="FECHA REGISTRO"
                  value={formData.fechaRegistro}
                  onChange={(value) => handleInputChange("fechaRegistro", value)}
                  disabled={!isFieldEnabled}
                  min={dateLimits.fechaRegistro.min}
                  max={dateLimits.fechaRegistro.max}
                  title={`Rango: desde ${dateLimits.fechaRegistro.min} hasta ${dateLimits.fechaRegistro.max}`}
                  labelClassName="w-40 pl-3"
                />
              </div>
              {/* Third Row: DIAS FERIADO */}
              <div className="flex flex-col justify-center items-end gap-2 mt-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Label className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap flex-shrink-0">DIAS FERIADO</Label>
                  <div className="w-10">
                    <NumericInput
                      value={formData.diasFeriadoHeader}
                      onChange={(field, value) => handleInputChange(field, value)}
                      disabled={!isFieldEnabled}
                      field="diasFeriadoHeader"
                      className="text-center"
                      placeholder={currentDatos.FERIADO1}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Label className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap flex-shrink-0">DIAS FERIADO</Label>
                  <div className="w-10">
                    <NumericInput
                      value={formData.diasFeriadoRol1}
                      onChange={(field, value) => handleInputChange(field, value)}
                      disabled={!isFieldEnabled}
                      field="diasFeriadoRol1"
                      className="text-center"
                      placeholder={currentDatos.FERIADO2}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-[300px_200px] gap-4 mt-4">
              <div>
                <div className="mb-3">
                  <NumericInput
                    label="N° de CONTRATO"
                    value={formData.numeroContrato}
                    onChange={(field, value) => handleInputChange(field, value)}
                    disabled={!isFieldEnabled}
                    field="numeroContrato"
                    className="text-right"
                    labelClassName="ml-3"
                  />
                </div>
                <div className="flex gap-2">
                  <Checkbox
                    className="bg-white dark:bg-gray-700 ml-3"
                    checked={formData.noTomaEnCuenta}
                    onCheckedChange={(checked) => handleInputChange("noTomaEnCuenta", checked as boolean)}
                    disabled={!isFieldEnabled}
                  />
                  <Label className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">NO Toma en Cuenta SUMA FIJA</Label>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 w-full">
                <div className="flex items-center gap-2">
                  <NumericInput
                    label="IVA 1"
                    value={formData.iva1}
                    onChange={(field, value) => handleInputChange(field, value)}
                    disabled={!isFieldEnabled}
                    field="iva1"
                    className="w-16 text-center"
                    placeholder={currentDatos.IVA1}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <NumericInput
                    label="IVA 2"
                    value={formData.iva2}
                    onChange={(field, value) => handleInputChange(field, value)}
                    disabled={!isFieldEnabled}
                    field="iva2"
                    className="w-16 text-center"
                    placeholder={currentDatos.IVA2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Calculation Section */}
      <div className="p-2 bg-white dark:bg-gray-900">
        <div className="grid grid-cols-[1fr_50px_1fr_1fr] gap-4 p-2">
          {/* Base Imponible Column */}
          <div className="space-y-2 border-t border-l border-b-2 border-r-2 border-gray-400 p-2 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <Label className="font-semibold text-xs text-gray-700 dark:text-gray-300">VALOR OPERATIVO</Label>
              <div className={widthInputs}>
                <NumericInput
                  value={formData.valorOperativo1}
                  onChange={(field, value) => handleInputChange(field, value)}
                  disabled={!isFieldEnabled}
                  field="valorOperativo1"
                  className="text-right"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Label className="font-semibold text-xs text-gray-700 dark:text-gray-300">SUMA FIJA</Label>
              <div className={widthInputs}>
                <NumericInput
                  value={formData.sumaFija1}
                  onChange={(field, value) => handleInputChange(field, value)}
                  disabled={!isFieldEnabled}
                  field="sumaFija1"
                  className="text-right"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Label className="font-semibold text-xs text-gray-700 dark:text-gray-300">I.V.A. (auto)</Label>
              <Input
                type="text"
                value={formData.iva1Calc}
                className={`border border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 text-xs ${widthInputs} text-right h-7`}
                readOnly
              />
            </div>
            <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
              <div className="flex justify-between items-center">
                <Label className="font-bold text-xs text-gray-700 dark:text-gray-300">BASE IMPONIBLE (auto)</Label>
                <Input
                  type="text"
                  value={formData.baseImponible}
                  className={`border border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 text-xs ${widthInputs} text-right font-bold h-7`}
                  readOnly
                />
              </div>
            </div>
          </div>
          {/* Botón para copiar valores */}
          <div className="flex items-center justify-center">
            <Button
              onClick={copyBaseToRegister}
              disabled={!isFieldEnabled}
              className="h-full w-full flex items-center justify-center"
              title="Copiar valores de Base Imponible a Valor Registro"
              size="sm"
              variant={'print'}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          {/* Valor Registro Column */}
          <div className="space-y-2 border-t border-l border-b-2 border-r-2 border-gray-400 p-2 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <Label className="font-semibold text-xs text-gray-700 dark:text-gray-300">VALOR OPERATIVO</Label>
              <div className={widthInputs}>
                <NumericInput
                  value={formData.valorOperativo2}
                  onChange={(field, value) => handleInputChange(field, value)}
                  disabled={!isFieldEnabled}
                  field="valorOperativo2"
                  className="text-right"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Label className="font-semibold text-xs text-gray-700 dark:text-gray-300">SUMA FIJA</Label>
              <div className={widthInputs}>
                <NumericInput
                  value={formData.sumaFija2}
                  onChange={(field, value) => handleInputChange(field, value)}
                  disabled={!isFieldEnabled}
                  field="sumaFija2"
                  className="text-right"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Label className="font-semibold text-xs text-gray-700 dark:text-gray-300">I.V.A. (auto)</Label>
              <Input
                type="text"
                value={formData.iva2Calc}
                className={`border border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 text-xs ${widthInputs} text-right h-7`}
                readOnly
              />
            </div>
            <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
              <div className="flex justify-between items-center">
                <Label className="font-bold text-xs text-gray-700 dark:text-gray-300">VALOR REG. (auto)</Label>
                <Input
                  type="text"
                  value={formData.valorReg}
                  className={`border border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 text-xs ${widthInputs} text-right font-bold h-7`}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Total Sellado Column */}
          <div className="space-y-2 border-t border-l border-b-2 border-r-2 border-gray-400 p-2 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <Label className="font-semibold text-xs text-gray-700 dark:text-gray-300">IMPORTE SELLADO (auto)</Label>
              <Input
                type="text"
                value={formData.importeSellado}
                className={`border border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 text-xs ${widthInputs} text-right h-7`}
                readOnly
              />
            </div>
            <div className="flex justify-between items-center">
              <Label className="font-semibold text-xs text-gray-700 dark:text-gray-300">DERECHO REGISTRO (auto)</Label>
              <Input
                type="text"
                value={formData.derechoReg}
                className={`border border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 text-xs ${widthInputs} text-right h-7`}
                readOnly
              />
            </div>
            <div className="flex justify-between items-center">
              <Label className="font-semibold text-xs text-gray-700 dark:text-gray-300">BONIFICACIÓN</Label>
              <div className={widthInputs}>
                <NumericInput
                  value={formData.bonificacion}
                  onChange={(field, value) => handleInputChange(field, value)}
                  disabled={!isFieldEnabled}
                  field="bonificacion"
                  className="text-right"
                />
              </div>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
              <div className="flex justify-between items-center">
                <Label className="font-bold text-xs text-gray-700 dark:text-gray-300">TOTAL SELLADO (auto)</Label>
                <Input
                  type="text"
                  value={formData.totalSellado}
                  className={`border border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 text-xs ${widthInputs} text-right font-bold h-7`}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Status Section */}
      <div className="p-2 border-t border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
        <div className="text-xs">
          <div className="mb-2 font-semibold text-gray-700 dark:text-gray-300">📋 Estado de Validación del Formulario:</div>
          
          {/* Grid de 2 columnas para las validaciones */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            {/* Columna 1 */}
            <div className="space-y-1">
              {/* Validación 1: Comprador ≠ Vendedor */}
              <div className="flex items-center gap-2">
                {formData.comprador !== formData.vendedor ? (
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400 font-bold">✗</span>
                )}
                <span className={formData.comprador !== formData.vendedor ? 
                  "text-green-700 dark:text-green-300" : 
                  "text-red-700 dark:text-red-300"
                }>
                  Comprador ≠ Vendedor
                </span>
              </div>

              {/* Validación 2: Diferencia Fecha Control → Ingreso */}
              {(() => {
                const fechaControl = new Date(formData.fechaControl);
                const fechaIngreso = new Date(formData.fechaIngreso);
                const diffDays1 = Math.ceil((fechaIngreso.getTime() - fechaControl.getTime()) / (1000 * 60 * 60 * 24));
                const diasFeriado1 = parseInt(formData.diasFeriadoHeader) || 0;
                const isValid = diffDays1 === diasFeriado1;
                
                return (
                  <div className="flex items-center gap-2">
                    {isValid ? (
                      <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-bold">✗</span>
                    )}
                    <span className={isValid ? 
                      "text-green-700 dark:text-green-300" : 
                      "text-red-700 dark:text-red-300"
                    }>
                      Control → Ingreso: {diffDays1}/{diasFeriado1} días
                    </span>
                  </div>
                );
              })()}

              {/* Validación 3: Diferencia Fecha Ingreso → Registro */}
              {(() => {
                const fechaIngreso = new Date(formData.fechaIngreso);
                const fechaRegistro = new Date(formData.fechaRegistro);
                const diffDays2 = Math.ceil((fechaRegistro.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24));
                const diasFeriado2 = parseInt(formData.diasFeriadoRol1) || 0;
                const isValid = diffDays2 === diasFeriado2;
                
                return (
                  <div className="flex items-center gap-2">
                    {isValid ? (
                      <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-bold">✗</span>
                    )}
                    <span className={isValid ? 
                      "text-green-700 dark:text-green-300" : 
                      "text-red-700 dark:text-red-300"
                    }>
                      Ingreso → Registro: {diffDays2}/{diasFeriado2} días
                    </span>
                  </div>
                );
              })()}

              {/* Validación 4: Número de Contrato */}
              {(() => {
                const numeroContrato = parseInt(formData.numeroContrato.trim()) || 0;
                const isValid = numeroContrato > 0;
                
                return (
                  <div className="flex items-center gap-2">
                    {isValid ? (
                      <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-bold">✗</span>
                    )}
                    <span className={isValid ? 
                      "text-green-700 dark:text-green-300" : 
                      "text-red-700 dark:text-red-300"
                    }>
                      N° Contrato: {numeroContrato} (&gt; 0)
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Columna 2 */}
            <div className="space-y-1">
              {/* Validación 5: Total Sellado */}
              {(() => {
                const totalSellado = parseFloat(formData.totalSellado) || 0;
                const isValid = totalSellado > 0;
                
                return (
                  <div className="flex items-center gap-2">
                    {isValid ? (
                      <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-bold">✗</span>
                    )}
                    <span className={isValid ? 
                      "text-green-700 dark:text-green-300" : 
                      "text-red-700 dark:text-red-300"
                    }>
                      Total Sellado: ${totalSellado.toFixed(2)} (&gt; 0)
                    </span>
                  </div>
                );
              })()}

              {/* Validación 6: Importe Sellado */}
              {(() => {
                const importeSellado = parseFloat(formData.importeSellado) || 0;
                const isValid = importeSellado > 0;
                
                return (
                  <div className="flex items-center gap-2">
                    {isValid ? (
                      <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-bold">✗</span>
                    )}
                    <span className={isValid ? 
                      "text-green-700 dark:text-green-300" : 
                      "text-red-700 dark:text-red-300"
                    }>
                      Importe Sellado: ${importeSellado.toFixed(2)} (&gt; 0)
                    </span>
                  </div>
                );
              })()}

              {/* Validación 7: Derecho de Registro */}
              {(() => {
                const derechoReg = parseFloat(formData.derechoReg) || 0;
                const isValid = derechoReg > 0;
                
                return (
                  <div className="flex items-center gap-2">
                    {isValid ? (
                      <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-bold">✗</span>
                    )}
                    <span className={isValid ? 
                      "text-green-700 dark:text-green-300" : 
                      "text-red-700 dark:text-red-300"
                    }>
                      Derecho Registro: ${derechoReg.toFixed(2)} (&gt; 0)
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
          
          {/* Estado general */}
          <div className="mt-3 pt-2 border-t border-gray-300 dark:border-gray-600">
            <div className="flex items-center gap-2 justify-center">
              {isFormValid ? (
                <>
                  <span className="text-green-600 dark:text-green-400 font-bold text-sm">✓</span>
                  <span className="text-green-700 dark:text-green-300 font-semibold">
                    Todas las validaciones son correctas. El formulario está listo para enviar.
                  </span>
                </>
              ) : (
                <>
                  <span className="text-red-600 dark:text-red-400 font-bold text-sm">✗</span>
                  <span className="text-red-700 dark:text-red-300 font-semibold">
                    Corrija los errores marcados para habilitar el botón de envío.
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-2 border-t border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => handleSubmit("accept")}
            disabled={!isFieldEnabled || !isFormValid}
            className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
            title={!isFormValid ? "Complete todos los campos requeridos para habilitar este botón" : ""}
          >
            {modeInfo.buttonText}
          </Button>
          <Button
            onClick={() => handleSubmit("cancel")}
            variant="outline"
          >
            Cancelar
          </Button>
        </div>
      </div>

      {/* Percentages Section */}
      <div className="p-2 border-t border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
        <div className="text-xs text-gray-700 dark:text-gray-300">
          <div className="mb-1 font-semibold">[ Porcentajes Válidos para el Cálculo ]</div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div>IVA BASE IMPONIBLE {currentDatos.IVA1}%</div>
            <div>IVA VALOR REG. {currentDatos.IVA2}%</div>
            <div>IMPUESTO SELLADO {currentDatos.IMPOSELLADO}%</div>
            <div>DERECHO REGISTRO {currentDatos.DERREGISTRO}%</div>
          </div>
        </div>
      </div>

      {/* Observations Section */}
      <div className="p-2 border-t border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
        <div className="text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">[ Observaciones ]</div>
        <Textarea
          className="w-full border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 text-xs h-12 resize-none"
          value={formData.observaciones}
          onChange={(e) => handleInputChange("observaciones", e.target.value)}
          placeholder="Ingrese sus observaciones aquí..."
          disabled={!isFieldEnabled}
        />
      </div>
    </div>
  )
}
