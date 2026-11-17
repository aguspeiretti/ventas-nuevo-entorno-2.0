import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getRecord } from "../../functions/apiFunctions";
import { CgScreen } from "react-icons/cg";

const FormTrato = ({ registerID, onContinue, dts }) => {
  const module = dts.data.Entity;
  const rEgisterID = dts.data.EntityId;
  const [newDatos, setNewDatos] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [coordinacion, setCoordinacion] = useState("");
  const [gestion, setGestion] = useState("");
  const [referenciaCliente, setReferenciaCliente] = useState("");
  const [nombreTrato, setNombreTrato] = useState("");
  const [fechaContratacion, setFechaContratacion] = useState("");
  const [fechaEnvio, setFechaEnvio] = useState("");
  const [carrera, setCarrera] = useState("");
  const [fields, setFields] = useState([]);
  const [temaProyecto, setTemaProyecto] = useState("");
  const [tratoTildado, setTratoTildado] = useState(true);
  const [anticipada, setAnticipada] = useState("NO");
  const [universidad, setUniversidad] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    id: registerID,
    Coord: "",
    Gestor_a: "",
    Referencia_Cliente: "",
    Fecha_de_Entrega_para_Ventas: "",
    Fecha_de_Contrataci_n_de_Servicios: "",
    Carrera_LA: "",
    Deal_Name: "",
    Tema_del_Proyecto_LA: "",
  });

  useEffect(() => {
    getRecord(module, rEgisterID)
      .then(function (result) {
        const datos = result.register;
        setNewDatos(datos);
        if (datos) {
          const universidades = datos.Universidades;
          const universidadId = universidades?.id || null;
          setUniversidad(universidadId);
        } else {
          setUniversidad(null);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [module, rEgisterID]);

  useEffect(() => {
    if (newDatos) {
      setNombreTrato(newDatos.Referencia_Cliente);
      setCoordinacion(newDatos.Coord || "");
      setGestion(newDatos.Gestor_a || "");
      setReferenciaCliente(newDatos.Referencia_Cliente || "");
      setFechaContratacion(newDatos.Fecha_de_Contrataci_n_de_Servicios || "");
      setFechaEnvio(newDatos.Fecha_de_Entrega_para_Ventas || "");
      setCarrera(newDatos.Carrera_LA || "");
      setTemaProyecto(newDatos.Tema_del_Proyecto_LA || "");
      setAnticipada(newDatos.Venta_anticipada || "");
    }
    getFields();
  }, [newDatos]);

  useEffect(() => {
    setFormData({
      ...formData,
      Coord: coordinacion,
      Gestor_a: gestion,
      Referencia_Cliente: referenciaCliente,
      Deal_Name: referenciaCliente,
      Fecha_de_Entrega_para_Ventas: fechaEnvio,
      Fecha_de_Contrataci_n_de_Servicios: fechaContratacion,
      Carrera_LA: carrera,
      Tema_del_Proyecto_LA: temaProyecto,
      Venta_anticipada: anticipada,
    });
  }, [
    coordinacion,
    gestion,
    referenciaCliente,
    fechaEnvio,
    fechaContratacion,
    carrera,
    anticipada,
  ]);

  const config = {
    Entity: "Deals",
    APIData: formData,
  };

  async function updateRecord(config) {
    try {
      const data = await window.ZOHO.CRM.API.updateRecord(config);
      return data;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `${error}`,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
      });
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
          text: "Hubo un problema al actualizar los datos. Por favor, inténtalo de nuevo.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          position: "top-end",
        });
        console.error("Error al actualizar el registro:", error);
      });
  };

  const getFields = () => {
    return window.ZOHO.CRM.META.getFields({ Entity: "Deals" })
      .then(function (response) {
        setFields(response.fields);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const getFieldValues = (fields, apiName) => {
    const field = fields.find((item) => item.api_name === apiName);
    return field ? field.pick_list_values || [] : [];
  };

  const pickers = fields.filter((item) => item.data_type === "picklist");
  const coord = getFieldValues(fields, "Coord");
  const gest = getFieldValues(fields, "Gestor_a");
  const anti = getFieldValues(fields, "Venta_anticipada");

  const handleSubmitRedirect = (event) => {
    event.preventDefault();
    if (isDisabled) return;

    const requiredFields = [
      { value: coordinacion, name: "Coordinación" },
      { value: gestion, name: "Gestión" },
      { value: referenciaCliente, name: "Referencia Cliente" },
      { value: fechaEnvio, name: "Fecha de envío a ventas" },
      { value: fechaContratacion, name: "Fecha de contratación de servicio" },
      { value: carrera, name: "Carrera" },
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
  const cerrar = () => {
    window.ZOHO.CRM.UI.Popup.closeReload().then(function (data) {
      console.log(data);
    });
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
          <div className="flex flex-col space-y-4">
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
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-full mx-auto">
          <div className="mb-6 flex justify-between items-center relative">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Formulario de Trato
              </h1>
              <button onClick={handleScreen} className="  z-50">
                <CgScreen />
              </button>
            </div>
            <button
              onClick={handleSubmitRedirect}
              disabled={isDisabled}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                isDisabled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Guardar y Continuar
            </button>
          </div>

          <form className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b">
                Información de Trato
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Coordinación
                  </label>
                  <select
                    value={coordinacion}
                    onChange={(e) =>
                      setCoordinacion(
                        e.target.value === "-None-" ? "" : e.target.value
                      )
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar...</option>
                    {coord.map((option, index) => (
                      <option key={index} value={option.display_value}>
                        {option.display_value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Gestión
                  </label>
                  <select
                    value={gestion}
                    onChange={(e) =>
                      setGestion(
                        e.target.value === "-None-" ? "" : e.target.value
                      )
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar...</option>
                    {gest.map((option, index) => (
                      <option key={index} value={option.display_value}>
                        {option.display_value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Venta Anticipada
                  </label>
                  <select
                    value={anticipada}
                    onChange={(e) => {
                      const value =
                        e.target.value === "-None-" ? "" : e.target.value;
                      setAnticipada(value);
                      if (value === "SI") {
                        Swal.fire({
                          title: "¿Estás seguro?",
                          text: "Marque 'SI ESTOY SEGURO' si se trata de un proyecto que su comienzo depende de la finalización de un proyecto en curso",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Sí, estoy seguro",
                          cancelButtonText: "Cancelar",
                        }).then((result) => {
                          if (!result.isConfirmed) {
                            setAnticipada("NO");
                          }
                        });
                      }
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {anti.map((option, index) => (
                      <option key={index} value={option.display_value}>
                        {option.display_value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b">
                Información de Proyecto
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Referencia Cliente
                  </label>
                  <input
                    type="text"
                    value={referenciaCliente}
                    onChange={(e) => setReferenciaCliente(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Fecha de Entrega para Ventas
                  </label>
                  <input
                    type="date"
                    value={fechaEnvio}
                    onChange={(e) => setFechaEnvio(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Fecha de Contratación de Servicio
                  </label>
                  <input
                    type="date"
                    value={fechaContratacion}
                    onChange={(e) => setFechaContratacion(e.target.value)}
                    readOnly
                    className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Carrera
                  </label>
                  <input
                    type="text"
                    value={carrera}
                    onChange={(e) => setCarrera(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Tema del Proyecto
                  </label>
                  <textarea
                    value={temaProyecto}
                    onChange={(e) => setTemaProyecto(e.target.value)}
                    maxLength={1900}
                    rows={3}
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

export default FormTrato;
