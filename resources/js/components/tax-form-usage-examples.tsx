import React from 'react';
import TaxForm from './tax-form';
import { TaxFormMode } from '@/types/tregsellos';
import { Tregsellos } from '@/types/tregsellos';

/**
 * Tax Form Usage Examples
 * 
 * Este archivo demuestra cómo usar el componente TaxForm en sus tres modos diferentes:
 * - demo: Muestra datos de ejemplo en modo solo lectura
 * - create: Formulario vacío para crear un nuevo registro
 * - update: Formulario pre-poblado para actualizar un registro existente
 */

// Datos de ejemplo para el modo update
const existingRecord: Tregsellos = {
  Id: 1,
  Registro: 1001,
  Contrato: 12345,
  Tipo: "Agenda LDI",
  Comprador: "1 DE ABRIL SA",
  CuitComp: "33711316839",
  DirComp: null,
  Vendedor: "1 DE ABRIL SA",
  CuitVend: "33711316839",
  DirVend: null,
  FContrato: "2025-01-15",
  FIngreso: "2025-01-15",
  FRegistro: "2025-01-15",
  Feriado1: 15,
  Feriado2: 15,
  Producto: "Soja",
  PesoNeto: 1000.00,
  PrecioUnit: 450.00,
  ValorOp1: "450000.00",
  ValorOp2: "0.00",
  SumaFija1: "0.00",
  SumaFija2: "0.00",
  Iva1: 10.50,
  Iva2: 10.50,
  BaseImpon: "497250.00",
  ValorReg: "497250.00",
  ImpSel: "5221.13",
  DerReg: "1243.13",
  Bonif: "0.00",
  Importe: "6464.26",
  Exportado: false,
  Alicuota1: null,
  Alicuota2: null,
  Subtipo: null,
  OtroAc: null,
  Moneda: 1, // ID de la moneda
  NomAct: null,
  NomSub: null,
  Tipograno: null,
  Partido: null,
  Relroles: null,
  RolCont: null,
  Operacion: null,
  TMoneda: "Pesos",
  nropresentacion: 1,
  estado: "activo",
  Observaciones: "Operación de compraventa de soja - Registro actualizado"
};

/**
 * Ejemplo 1: Modo Demo
 * Muestra el formulario con datos de ejemplo en modo solo lectura
 */
export const TaxFormDemoExample: React.FC = () => {
  const handleSubmit = (data: Partial<Tregsellos>) => {
    console.log('Demo mode data:', data);
    // En modo demo, típicamente no se realizan acciones
  };

  const handleCancel = () => {
    console.log('Demo cancelled');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ejemplo: Modo Demo</h2>
      <p className="text-gray-600 mb-4">
        Este modo muestra el formulario con datos de ejemplo en modo solo lectura.
        Útil para demostraciones o previsualizaciones.
      </p>
      
      <TaxForm
        mode="demo"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

/**
 * Ejemplo 2: Modo Create
 * Muestra el formulario vacío para crear un nuevo registro
 */
export const TaxFormCreateExample: React.FC = () => {
  const handleSubmit = (data: Partial<Tregsellos>) => {
    console.log('Creating new record:', data);
    // Aquí enviarías los datos al servidor para crear el registro
    // API call: POST /api/tregsellos
  };

  const handleCancel = () => {
    console.log('Create action cancelled');
    // Redirigir o cerrar el formulario
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ejemplo: Modo Create</h2>
      <p className="text-gray-600 mb-4">
        Este modo muestra el formulario vacío para crear un nuevo registro.
        Todos los campos están habilitados para edición.
      </p>
      
      <TaxForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

/**
 * Ejemplo 3: Modo Update
 * Muestra el formulario pre-poblado para actualizar un registro existente
 */
export const TaxFormUpdateExample: React.FC = () => {
  const handleSubmit = (data: Partial<Tregsellos>) => {
    console.log('Updating record:', data);
    // Aquí enviarías los datos al servidor para actualizar el registro
    // API call: PUT /api/tregsellos/{id}
  };

  const handleCancel = () => {
    console.log('Update action cancelled');
    // Redirigir o cerrar el formulario
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ejemplo: Modo Update</h2>
      <p className="text-gray-600 mb-4">
        Este modo muestra el formulario pre-poblado con datos existentes.
        Todos los campos están habilitados para edición.
      </p>
      
      <TaxForm
        mode="update"
        initialData={existingRecord}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

/**
 * Componente principal que muestra todos los ejemplos
 */
export const TaxFormExamplesPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Tax Form - Ejemplos de Uso</h1>
      
      <div className="space-y-12">
        <TaxFormDemoExample />
        <div className="border-t-2 border-gray-200 pt-8">
          <TaxFormCreateExample />
        </div>
        <div className="border-t-2 border-gray-200 pt-8">
          <TaxFormUpdateExample />
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Notas de Implementación</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Modo Demo:</strong> No muestra botones de acción, solo información para demostrar</li>
          <li><strong>Modo Create:</strong> Muestra botón "Crear" y campos habilitados</li>
          <li><strong>Modo Update:</strong> Muestra botón "Actualizar" y campos habilitados con datos existentes</li>
          <li>Todos los campos respetan la propiedad <code>isFieldEnabled</code> basada en el modo</li>
          <li>Los cálculos automáticos funcionan en todos los modos (excepto demo)</li>
        </ul>
      </div>
    </div>
  );
};

export default TaxFormExamplesPage;
