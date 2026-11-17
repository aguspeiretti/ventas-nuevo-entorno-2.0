import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getRecord } from "../../functions/apiFunctions";
import { CgScreen } from "react-icons/cg";

const FormPresupuesto = ({ registerID, onContinue, dts, onReturn }) => {
  const module = dts.data.Entity;
  const rEgisterID = dts.data.EntityId;
  const [newDatos, setNewDatos] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);
  const [formFields, setFormFields] = useState({
    primerPago: 0,
    importeFinal: "",
    dni: "",
    nombreYapellido: "",
    dirFacturacion: "",
    ciudad: "",
    valorDolar: "",
    numeroPaginas: "",
  });

  useEffect(() => {
    getRecord(module, rEgisterID)
      .then(function (result) {
        const datos = result.register;
        setNewDatos(datos);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [module, rEgisterID]);

  useEffect(() => {
    if (newDatos) {
      setFormFields({
        primerPago: newDatos.Primer_pago_USD || 0,
        dni: newDatos.DNI_NIF_CIF || "",
        dirFacturacion: newDatos.Direcci_n_de_facturaci_n || "",
        nombreYapellido: newDatos.Nombre_y_Apellidos_Empresa || "",
        numeroPaginas: newDatos.N_mero_de_P_ginas_LA || 0,
        importeFinal: newDatos.Importe_final || "",
        ciudad: newDatos.Ciudad || "",
        valorDolar: newDatos.Valor_del_dolar || "",
      });
    }
  }, [newDatos]);

  const [formData, setFormData] = useState({
    id: registerID,
    Primer_pago_USD: "",
    Direcci_n_de_facturaci_n: "",
    Nombre_y_Apellidos_Empresa: "",
    DNI_NIF_CIF: "",
    Importe_final: "",
    N_mero_de_P_ginas_LA: "",
    Ciudad: "",
    Valor_del_dolar: "",
  });

  useEffect(() => {
    setFormData({
      ...formData,
      Primer_pago_USD: formFields.primerPago,
      Direcci_n_de_facturaci_n: formFields.dirFacturacion,
      Nombre_y_Apellidos_Empresa: formFields.nombreYapellido,
      DNI_NIF_CIF: formFields.dni,
      Importe_final: formFields.importeFinal,
      N_mero_de_P_ginas_LA: formFields.numeroPaginas,
      Ciudad: formFields.ciudad,
      Valor_del_dolar: formFields.valorDolar,
    });
  }, [formFields]);

  const config = {
    Entity: "Deals",
    APIData: formData,
  };

  async function updateRecord(config) {
    try {
      return await window.ZOHO.CRM.API.updateRecord(config);
    } catch (error) {
      throw error;
    }
  }

  const guardarDatos = () => {
    updateRecord(config)
      .then((resultado) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...resultado.data,
        }));

        Swal.fire({
          title: "Éxito",
          text: "¡Los datos se actualizaron correctamente!",
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al actualizar los datos.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          position: "top-end",
        });
      });
  };
  const cerrar = () => {
    window.ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
      console.log(data);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isDisabled) return;

    const requiredFields = [
      { value: formFields.primerPago, name: "Primer Pago" },
      { value: formFields.dni, name: "DNI/CIF" },
      { value: formFields.nombreYapellido, name: "Nombre y apellidos" },
      { value: formFields.dirFacturacion, name: "Dirección de facturación" },
      { value: formFields.ciudad, name: "Ciudad" },
    ];

    const emptyField = requiredFields.find((field) => !field.value);

    if (emptyField) {
      Swal.fire({
        title: `Complete ${emptyField.name}`,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
      return;
    }

    setIsDisabled(true);
    try {
      guardarDatos();
      onContinue();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDisabled(false);
    }
  };
  const handleScreen = () => {
    window.ZOHO.CRM.UI.Resize({ height: "95%", width: "100%" }).then(function (
      data
    ) {});
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <div className="w-64 bg-white shadow-lg p-6 border-r border-gray-200">
        <div className="space-y-6 flex flex-col justify-between h-full">
          <div className="space-y-6">
            {[
              { title: "Información de Trato", step: 1 },
              { title: "Información de Proyecto", step: 2 },
              { title: "Información Final", step: 3 },
              { title: "Comentario coordinador", step: 4 },
            ].map((section) => (
              <div key={section.step} className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= section.step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {section.step}
                </div>
                <span
                  className={`text-sm font-medium ${
                    currentStep >= section.step
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {section.title}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={cerrar}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              isDisabled ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            cerrar
          </button>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-full mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Información de Presupuesto
              </h1>
              <button onClick={handleScreen} className="  z-50">
                <CgScreen />
              </button>
            </div>
            <div className="flex gap-4">
              <button
                onClick={onReturn}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handleSubmit}
                disabled={isDisabled}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  isDisabled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Guardar y Continuar
              </button>
            </div>
          </div>

          <form className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b">
                Información de Presupuesto
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Importe Final (USD)
                  </label>
                  <input
                    type="number"
                    value={formFields.importeFinal}
                    readOnly
                    className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Primer Pago (USD)
                  </label>
                  <input
                    type="number"
                    value={formFields.primerPago}
                    readOnly
                    className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Número de Páginas
                  </label>
                  <input
                    type="number"
                    value={formFields.numeroPaginas}
                    readOnly
                    className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Valor del Dólar
                  </label>
                  <input
                    type="number"
                    value={formFields.valorDolar}
                    readOnly
                    className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b">
                Datos de Facturación
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    CUIL/RFC/ID
                  </label>
                  <input
                    type="text"
                    value={formFields.dni}
                    onChange={(e) =>
                      setFormFields({ ...formFields, dni: e.target.value })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Nombre y Apellidos
                  </label>
                  <input
                    type="text"
                    value={formFields.nombreYapellido}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        nombreYapellido: e.target.value,
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Dirección de Facturación
                  </label>
                  <input
                    type="text"
                    value={formFields.dirFacturacion}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        dirFacturacion: e.target.value,
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={formFields.ciudad}
                    onChange={(e) =>
                      setFormFields({ ...formFields, ciudad: e.target.value })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormPresupuesto;
