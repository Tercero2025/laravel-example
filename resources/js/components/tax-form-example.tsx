import React from 'react';
import TaxForm from '@/components/tax-form';
import { Tregsellos, TaxFormMode } from '@/types/tregsellos';
import { router } from '@inertiajs/react';

interface TaxFormPageProps {
  tregsello?: Tregsellos;
  mode?: 'create' | 'edit' | 'view';
}

export default function TaxFormPage({ tregsello, mode = 'create' }: TaxFormPageProps) {
  const handleSubmit = (data: Partial<Tregsellos>) => {
    if (mode === 'create') {
      router.post(route('tregsellos.store'), data);
    } else if (mode === 'edit' && tregsello?.Id) {
      router.put(route('tregsellos.update', tregsello.Id), data);
    }
  };

  const handleCancel = () => {
    router.visit(route('tregsellos.index'));
  };

  // Mapear el modo de la página al modo del componente TaxForm
  const getTaxFormMode = () => {
    switch (mode) {
      case 'create':
        return 'create';
      case 'edit':
        return 'update';
      case 'view':
        return 'demo'; // Usar modo demo para vista de solo lectura
      default:
        return 'create';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {mode === 'create' && 'Nuevo Registro de Sello'}
          {mode === 'edit' && `Editar Registro ${tregsello?.Id}`}
          {mode === 'view' && `Ver Registro ${tregsello?.Id}`}
        </h1>
      </div>

      <TaxForm
        mode={getTaxFormMode()}
        initialData={tregsello}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}

// Ejemplo de uso con datos específicos
export function ExampleUsage() {
  // Datos de ejemplo para mostrar cómo usar el formulario
  const exampleTregsellos: Tregsellos = {
    Id: 1,
    Registro: 12345,
    Contrato: 98765,
    Tipo: 'CV',
    Comprador: '1 DE ABRIL SA',
    CuitComp: '33711316839',
    DirComp: 'AV. CORRIENTES 1234',
    Vendedor: 'ACEITERA GRAL. SA',
    CuitVend: '30123456789',
    DirVend: 'RUTA 9 KM 123',
    FContrato: '2025-07-22T00:00:00.000Z',
    FIngreso: '2025-07-22T00:00:00.000Z',
    FRegistro: '2025-07-22T00:00:00.000Z',
    Feriado1: 15,
    Feriado2: 15,
    Producto: 'SOJA',
    PesoNeto: 25000.50,
    PrecioUnit: 380.75,
    ValorOp1: '9518750.00',
    ValorOp2: '0.00',
    SumaFija1: '0.00',
    SumaFija2: '0.00',
    Iva1: 10.5,
    Iva2: 10.5,
    BaseImpon: '9518750.00',
    ValorReg: '0.00',
    ImpSel: '99946.88',
    DerReg: '0.00',
    Bonif: '0.00',
    Importe: '9618696.88',
    Exportado: false,
    Alicuota1: 10.5,
    Alicuota2: 10.5,
    Subtipo: null,
    OtroAc: null,
    Moneda: 1,
    NomAct: 'COMPRAVENTA CEREALES',
    NomSub: null,
    Tipograno: 'SO',
    Partido: 'PERGAMINO',
    Relroles: null,
    RolCont: null,
    Operacion: 'C',
    TMoneda: 'PE',
    nropresentacion: 0,
    estado: 'A',
    Observaciones: 'Operación de compraventa de soja',
    moneda: {
      Indice: 1,
      Moneda: 'PESOS',
      Tipomoneda: 'PE'
    }
  };

  return (
    <TaxFormPage 
      tregsello={exampleTregsellos} 
      mode="edit" 
    />
  );
}
