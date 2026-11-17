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
  const [moneda, setMoneda] = useState("");
  const [dtsUsuario, setDtsUsuario] = useState("");
  const [fields, setFields] = useState([]);
  const [comentarioAdicional1erPago, setComentarioAdicional1erPago] =
    useState("");
  const [
    comentarioAdicional1erPagoLength,
    setComentarioAdicional1erPagoLength,
  ] = useState(0);
  const [formFields, setFormFields] = useState({
    primerPago: 0,
    importeFinal: "",
    dni: "",
    nombreYapellido: "",
    dirFacturacion: "",
    tipoFacturacion: "",
    valorDolar: "",
    numeroPaginas: "",
    tipoDePersona: "",
  });

  useEffect(() => {
    if (!newDatos) return;

    // Normalizar: puede venir como objeto {id,...} o directamente como string
    const contactId =
      newDatos?.Contact_Name?.id ??
      newDatos?.Contact_Name ?? // por si viene como string
      null;

    console.log("desdepresupuesto", newDatos);

    if (!contactId) {
      console.warn(
        "El registro no tiene Contact_Name asignado o no trae id:",
        newDatos?.Contact_Name,
      );
      return;
    }

    window.ZOHO.CRM.API.getRecord({
      Entity: "Contacts",
      approved: "both",
      RecordID: contactId,
    })
      .then((res) => {
        const contacto = res?.data?.[0];
        if (contacto) setDtsUsuario(contacto);
      })
      .catch((err) => {
        console.error("Error al traer el contacto:", err);
        Swal.fire("Ups", "No pude traer el contacto", "error");
      });
  }, [newDatos]); // <-- solo cuando newDatos cambie

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
      setMoneda(newDatos.Moneda_Principal);
      setComentarioAdicional1erPago(
        newDatos.Comentarios_1er_Pago_LATAM_Extendido || "",
      );
      setComentarioAdicional1erPagoLength(
        (newDatos.Comentarios_1er_Pago_LATAM_Extendido || "").length,
      );

      const getValidValue = (...values) =>
        values.find((value) => value?.trim()) || "";

      setFormFields({
        valorDolar: newDatos.Cotizacion_USD_EUR || "",
        numeroPaginas: newDatos.N_mero_de_P_ginas_LA || 0,
        primerPago: newDatos.Primer_pago_moneda_principal || 0,
        importeFinal: newDatos.Importe_final_moneda_principal || "",
        dirFacturacion: getValidValue(
          newDatos.Direcci_n_de_facturaci_n ||
            dtsUsuario?.Direcci_n_de_facturaci_n,
        ),
        nombreYapellido: getValidValue(
          newDatos.Nombre_y_Apellidos_Empresa || dtsUsuario?.Nombre_y_Apellidos,
        ),
        dni: getValidValue(
          newDatos.DNI_NIF_CIF ||
            dtsUsuario?.Documento_Nacional_de_Identificaci_n_DNI_CC_INE,
        ),

        tipoFacturacion: getValidValue(
          newDatos.tipoFacturacion || dtsUsuario?.tipoFacturacion,
        ),
        tipoDePersona: getValidValue(
          newDatos.Tipo_de_persona || dtsUsuario?.Tipo_de_persona,
        ),
      });
    }
  }, [newDatos, dtsUsuario]);

  const [formData2, setFormData2] = useState({
    id: dtsUsuario.id,
    Direcci_n_de_facturaci_n: "",
    Nombre_y_Apellido: "",
    Documento_Nacional_de_Identificaci_n_DNI_CC_INE: "",
    tipoFacturacion: "",
    Tipo_de_persona: "",
  });

  useEffect(() => {
    setFormData2({
      ...formData2,
      id: dtsUsuario.id,
      Direcci_n_de_facturaci_n: formFields.dirFacturacion,
      Nombre_y_Apellidos: formFields.nombreYapellido,
      Documento_Nacional_de_Identificaci_n_DNI_CC_INE: formFields.dni,

      Tipo_de_persona: formFields.tipoDePersona,
    });
  }, [formFields]);

  const [formData, setFormData] = useState({
    id: registerID,
    Primer_pago_moneda_principal: "",
    Direcci_n_de_facturaci_n: "",
    Nombre_y_Apellidos_Empresa: "",
    DNI_NIF_CIF: "",
    Importe_final_moneda_principal: "",
    N_mero_de_P_ginas_LA: "",

    Cotizacion_USD_EUR: "",
    Tipo_de_persona: "",
    Comentarios_1er_Pago_LATAM_Extendido: "",
  });

  useEffect(() => {
    setFormData({
      ...formData,
      id: registerID,
      Primer_pago_moneda_principal: formFields.primerPago,
      Direcci_n_de_facturaci_n: formFields.dirFacturacion,
      Nombre_y_Apellidos_Empresa: formFields.nombreYapellido,
      DNI_NIF_CIF: formFields.dni,
      Importe_final_moneda_principal: formFields.importeFinal,
      N_mero_de_P_ginas_LA: formFields.numeroPaginas,

      Cotizacion_USD_EUR: formFields.valorDolar,
      Tipo_de_persona: formFields.tipoDePersona,
      Comentarios_1er_Pago_LATAM_Extendido: comentarioAdicional1erPago,
    });
  }, [formFields, comentarioAdicional1erPago]);

  const config = {
    Entity: "Deals",
    APIData: formData,
  };

  const config2 = {
    Entity: "Contacts",
    APIData: formData2,
  };

  async function updateRecord(config) {
    try {
      console.log("Datos enviados a updateRecord:", config);
      const response = await window.ZOHO.CRM.API.updateRecord(config);
      console.log("Respuesta de updateRecord:", response);

      return response; // Devuelve la respuesta si necesitas usarla en otro lugar
    } catch (error) {
      throw error;
    }
  }

  async function updateRecord2(config2) {
    try {
      console.log("Datos enviados a updateRecord2:", config2);

      const response = await window.ZOHO.CRM.API.updateRecord(config2);

      console.log("Respuesta de updateRecord2:", response);

      return response; // Devuelve la respuesta si necesitas usarla en otro lugar
    } catch (error) {
      console.error("Error en updateRecord2:", error);
      throw error;
    }
  }

  const guardarDatos = () => {
    updateRecord(config)
      .then((resultado) => {
        // setFormData((prevFormData) => ({
        //   ...prevFormData,
        //   ...resultado.data.data,
        // }));

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

  const guardarDatos2 = () => {
    updateRecord2(config2).then((resultado) => {
      console.log(resultado);

      //   setFormData2((prevFormData2) => ({
      //     ...prevFormData2,
      //     ...resultado.data,
      //   }));

      //   Swal.fire({
      //     title: "Éxito",
      //     text: "¡Los datos se actualizaron correctamente!",
      //     icon: "success",
      //     toast: true,
      //     position: "top-end",
      //     timer: 2000,
      //     showConfirmButton: false,
      //   });
      // })
      // .catch((error) => {
      //   Swal.fire({
      //     title: "Error",
      //     text: "Hubo un problema al actualizar los datos.",
      //     icon: "error",
      //     timer: 2000,
      //     showConfirmButton: false,
      //     position: "top-end",
      //   });
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

    if (
      !formFields.tipoDePersona ||
      formFields.tipoDePersona === "-None-" ||
      formFields.tipoDePersona === "Seleccionar..."
    ) {
      Swal.fire({
        title: "Complete Tipo de Facturación",
        text: "Debe seleccionar un tipo de facturación válido",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
      return;
    }

    const requiredFields = [
      { value: formFields.primerPago, name: "Primer Pago" },
      { value: formFields.dni, name: "DNI/CIF" },
      { value: formFields.nombreYapellido, name: "Nombre y apellidos" },
      { value: formFields.dirFacturacion, name: "Dirección de facturación" },
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
      guardarDatos2();
      guardarDatos();
      onContinue();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDisabled(false);
    }
  };
  const handleScreen = () => {
    window.ZOHO.CRM.UI.Resize({ height: "95%", width: "100%" }).then(
      function (data) {},
    );
  };

  const getFields = () => {
    return window.ZOHO.CRM.META.getFields({ Entity: "Contacts" })
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

  const tipo = getFieldValues(fields, "Tipo_de_persona");

  useEffect(() => {
    getFields();
  }, []);

  const WEB_ORIGEN_TYM = [
    "TyM Argentina",
    "TyM México",
    "TyM Colombia",
    "TyM Chile",
    "TyM Panamá",
    "TyM EEUU",
  ];
  const webOrigen = (newDatos?.Web_Origen || "").trim();
  const mostrarComentarioAdicional1erPago = WEB_ORIGEN_TYM.includes(webOrigen);

  const handleComentarioAdicional1erPagoChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 1900) {
      setComentarioAdicional1erPago(inputValue);
      setComentarioAdicional1erPagoLength(inputValue.length);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
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

      <div className="flex-1 p-8 overflow-auto">
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
                    Importe Final {}
                  </label>
                  <input
                    type="number"
                    value={formFields.importeFinal}
                    readOnly
                    className="w-full rounded-md border-2 border-gray-200 bg-gray-50 shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Primer Pago {moneda}
                  </label>
                  <input
                    type="number"
                    value={formFields.primerPago}
                    readOnly
                    className="w-full rounded-md border-2 border-gray-200 bg-gray-50 shadow-sm"
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
                    className="w-full rounded-md border-2 border-gray-200 bg-gray-50 shadow-sm"
                  />
                </div>

                {mostrarComentarioAdicional1erPago && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Comentarios adicionales 1er pago
                    </label>
                    <textarea
                      value={comentarioAdicional1erPago}
                      onChange={handleComentarioAdicional1erPagoChange}
                      maxLength={1900}
                      rows={3}
                      className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Comentarios adicionales sobre el primer pago..."
                    />
                    <span className="text-sm text-gray-500">
                      Caracteres restantes:{" "}
                      {1900 - comentarioAdicional1erPagoLength}
                    </span>
                  </div>
                )}

                {moneda && moneda !== "USD" ? null : (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Valor del {moneda === "USD" ? "dolar" : "euro"}
                    </label>
                    <input
                      type="number"
                      value={formFields.valorDolar}
                      readOnly
                      className="w-full rounded-md border-2 border-gray-200 bg-gray-50 shadow-sm"
                    />
                  </div>
                )}
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
                    className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Tipo de Facturacion
                  </label>
                  <select
                    value={formFields.tipoDePersona}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        tipoDePersona:
                          e.target.value === "-None-" || e.target.value === ""
                            ? ""
                            : e.target.value,
                      })
                    }
                    className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="" disabled>
                      Seleccionar...
                    </option>
                    {tipo.map((option, index) => (
                      <option key={index} value={option.display_value}>
                        {option.display_value}
                      </option>
                    ))}
                  </select>
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
