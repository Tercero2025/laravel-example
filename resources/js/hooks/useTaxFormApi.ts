import { useState, useEffect } from 'react';
import { DatosResponse, SqlDatos, MonedaOption, ClienteOption, ProductoOption } from '@/types/tregsellos';

/**
 * Hook para manejo de llamadas a la API
 * Centraliza todas las llamadas a endpoints y manejo de datos de configuración
 */
export const useTaxFormApi = () => {
  const [sqlDatos, setSqlDatos] = useState<SqlDatos[]>([]);
  const [monedas, setMonedas] = useState<MonedaOption[]>([]);
  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [productos, setProductos] = useState<ProductoOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos de configuración
  const fetchConfigurationData = async () => {
    try {
      const response = await fetch('/api/tregsellos/datos');
      if (response.ok) {
        const data: DatosResponse = await response.json();

        setSqlDatos(data.actos || []);
        setMonedas(data.monedas || []);
        setClientes(data.clientes || []);
        setProductos(data.productos || []);

        return data;
      } else {
        console.error('Error al cargar datos de configuración:', response.status);
        return getFallbackData();
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      return getFallbackData();
    } finally {
      setIsLoading(false);
    }
  };

  // Datos de fallback en caso de error
  const getFallbackData = () => {
    const fallbackData = {
      actos: [{
        ACTO: 'Agenda | 01',
        CODIGO: '01',
        DESCRIPCION: 'Agenda',
        USAPRODUCTO: 0,
        IVA1: '10.50',
        IVA2: '10.50',
        IMPOSELLADO: '1.05',
        DERREGISTRO: '0.25',
        BONIFICACION: '0.00',
        FERIADO1: '15',
        FERIADO2: '15'
      }],
      monedas: [{
        value: 'Pesos',
        label: 'Pesos',
        indice: 1,
        tipomoneda: 'PE'
      }],
      clientes: [{
        value: '1 DE ABRIL SA | 33711316839',
        label: '1 DE ABRIL SA | 33711316839',
        razonsocial: '1 DE ABRIL SA',
        cuit: '33711316839'
      }],
      productos: [{
        value: 'Maíz',
        label: 'Maíz',
        codigo: 1
      }]
    };

    setSqlDatos(fallbackData.actos);
    setMonedas(fallbackData.monedas);
    setClientes(fallbackData.clientes);
    setProductos(fallbackData.productos);

    return fallbackData;
  };

  // Obtener datos de datosente para un cliente
  const fetchDatosenteClient = async (cuit: string) => {
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

  // Obtener dirección de un cliente
  const fetchClientAddress = async (cuit: string) => {
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

  // Insertar un nuevo registro de sellado
  const insertTregsellos = async (tregsellosData: any) => {
    try {
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

  // Inicializar datos al montar
  useEffect(() => {
    fetchConfigurationData();
  }, []);

  return {
    sqlDatos,
    monedas,
    clientes,
    productos,
    isLoading,
    fetchConfigurationData,
    fetchDatosenteClient,
    fetchClientAddress,
    insertTregsellos
  };
};
