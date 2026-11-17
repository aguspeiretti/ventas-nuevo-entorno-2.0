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
  const [comentarioVentaAnticipada, setComentarioVentaAnticipada] =
    useState("");
  const [comentarioVentaAnticipadaLength, setComentarioVentaAnticipadaLength] =
    useState(0);
  const [gestionadoBackoffice, setGestionadoBackoffice] = useState("NO");
  const [enEsperaDelClientePor, setEnEsperaDelClientePor] = useState("");
  const [comentarioAdicional1erPago, setComentarioAdicional1erPago] =
    useState("");
  const [
    comentarioAdicional1erPagoLength,
    setComentarioAdicional1erPagoLength,
  ] = useState(0);

  console.log("datos en trato", newDatos);

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
    Gestionado_por_backoffice: "NO",
    En_espera_del_cliente_por: "",
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
      setGestionadoBackoffice(newDatos.Gestionado_por_backoffice || "");
      setReferenciaCliente(newDatos.Referencia_Cliente || "");
      setFechaContratacion(newDatos.Fecha_de_Contrataci_n_de_Servicios || "");
      setFechaEnvio(newDatos.Fecha_de_Entrega_para_Ventas || "");
      setCarrera(newDatos.Carrera_LA || "");
      setTemaProyecto(newDatos.Tema_del_Proyecto_LA || "");
      setEnEsperaDelClientePor(newDatos.En_espera_del_cliente_por || "");
      setComentarioAdicional1erPago(
        newDatos.Comentario_adicionales_1er_pago_LATAM || "",
      );
      setComentarioAdicional1erPagoLength(
        (newDatos.Comentario_adicionales_1er_pago_LATAM || "").length,
      );

      // Mostrar el valor invertido: si en la DB está "SI" mostrar "NO" y viceversa
      const storedAnti = newDatos.Venta_anticipada || "";
      setAnticipada(
        storedAnti === "SI" ? "NO" : storedAnti === "NO" ? "SI" : storedAnti,
      );

      setComentarioVentaAnticipada(newDatos.Comentario_venta_anticipada || "");
      setComentarioVentaAnticipadaLength(
        (newDatos.Comentario_venta_anticipada || "").length,
      );
    }
    getFields();
  }, [newDatos]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      Coord: coordinacion,
      Gestor_a: gestion,
      Referencia_Cliente: referenciaCliente,
      Deal_Name: referenciaCliente,
      Fecha_de_Entrega_para_Ventas: fechaEnvio,
      Fecha_de_Contrataci_n_de_Servicios: fechaContratacion,
      Gestionado_por_backoffice: gestionadoBackoffice,
      Carrera_LA: carrera,
      Tema_del_Proyecto_LA: temaProyecto,
      // Guardar invertido: si el usuario seleccionó "SI" guardar "NO" y viceversa
      Venta_anticipada:
        anticipada === "SI" ? "NO" : anticipada === "NO" ? "SI" : anticipada,
      Comentario_venta_anticipada: comentarioVentaAnticipada,
      En_espera_del_cliente_por: enEsperaDelClientePor,
      Comentario_adicionales_1er_pago_LATAM: comentarioAdicional1erPago,
    }));
  }, [
    coordinacion,
    gestion,
    referenciaCliente,
    fechaEnvio,
    fechaContratacion,
    carrera,
    anticipada,
    gestionadoBackoffice,
    temaProyecto,
    comentarioVentaAnticipada,
    enEsperaDelClientePor,
    comentarioAdicional1erPago,
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

  const WEB_ORIGEN_PERMITIDOS = [
    "ComoCitar",
    "Cursos",
    "Custom Sneaker",
    "ProfeConClaseEs",
    "ADEYDERECHO",
    "TusOpos",
    "PlagiumChecker",
    "Tu Prog Didáctica",
    "TU",
    "TUTFM",
    "Quiero mi TFG",
    "TFGES",
    "TFGON",
    "TesisESP",
    "Plagio",
    "Academikast",
    "TFGTFM.es",
    "TuTFGCom",
    "TuTesis",
    "Otro país",
    "Landing TU",
    "TFGComprar",
    "Blog",
    "ConsejosUniversitarios",
    "Programaciones Didácticas",
  ];

  const webOrigen = (newDatos?.Web_Origen || "").trim();
  const mostrarGestionadoBackoffice = WEB_ORIGEN_PERMITIDOS.includes(webOrigen);

  const WEB_ORIGEN_TYM = [
    "TyM Argentina",
    "TyM México",
    "TyM Colombia",
    "TyM Chile",
    "TyM Panamá",
    "TyM EEUU",
    "TyM Perú",
  ];
  const mostrarComentarioAdicional1erPago = WEB_ORIGEN_TYM.includes(webOrigen);

  console.log(
    "webOrigen:",
    JSON.stringify(webOrigen),
    "| mostrarComentario:",
    mostrarComentarioAdicional1erPago,
  );

  const handleComentarioVentaAnticipadaChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 250) {
      setComentarioVentaAnticipada(inputValue);
      setComentarioVentaAnticipadaLength(inputValue.length);
    }
  };

  const handleComentarioAdicional1erPagoChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 250) {
      setComentarioAdicional1erPago(inputValue);
      setComentarioAdicional1erPagoLength(inputValue.length);
    }
  };

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
  const backoffice = getFieldValues(fields, "Gestionado_por_backoffice");
  const esperaClientePor = getFieldValues(fields, "En_espera_del_cliente_por");

  const mostrarEnEsperaDelClientePor =
    anticipada === "NO" && newDatos?.Stage === "Cerrado ganado";

  useEffect(() => {
    if (!mostrarEnEsperaDelClientePor) {
      setEnEsperaDelClientePor("");
    }
  }, [mostrarEnEsperaDelClientePor]);

  const handleSubmitRedirect = (event) => {
    event.preventDefault();
    if (isDisabled) return;

    const requiredFields = [
      { value: coordinacion, name: "Coordinación" },
      { value: gestion, name: "Gestión" },
      { value: referenciaCliente, name: "Referencia Cliente" },
      { value: fechaEnvio, name: "Fecha de envío a ventas" },
      // { value: fechaContratacion, name: "Fecha de contratación de servicio" },
      { value: carrera, name: "Carrera" },
      { value: anticipada, name: "¿Se puede empezar ya?" },
    ];

    if (anticipada === "NO") {
      requiredFields.push({
        value: comentarioVentaAnticipada,
        name: "Expliqué por qué no se puede empezar aún",
      });
    }

    if (mostrarEnEsperaDelClientePor) {
      requiredFields.push({
        value: enEsperaDelClientePor,
        name: "En espera del cliente por",
      });
    }

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
    window.ZOHO.CRM.UI.Resize({ height: "95%", width: "100%" }).then(
      function (data) {},
    );
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

      <div className="h-auto p-8 w-full overflow-auto">
        <div className="max-w-full h-full mx-auto ">
          <div className="mb-6 flex justify-between items-center relative ">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Formulario de Trato
              </h1>
              <button onClick={handleScreen} className="z-50">
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

          <form className="space-y-6 ">
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
                        e.target.value === "-None-" ? "" : e.target.value,
                      )
                    }
                    className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                        e.target.value === "-None-" ? "" : e.target.value,
                      )
                    }
                    className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    ¿Se puede empezar ya?
                  </label>
                  <select
                    value={anticipada}
                    onChange={(e) => {
                      const value =
                        e.target.value === "-None-" ? "" : e.target.value;
                      setAnticipada(value);

                      if (value === "SI") {
                        setComentarioVentaAnticipada("");
                        setComentarioVentaAnticipadaLength(0);
                      }
                    }}
                    className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {anti.map((option, index) => (
                      <option key={index} value={option.display_value}>
                        {option.display_value}
                      </option>
                    ))}
                  </select>
                </div>

                {mostrarEnEsperaDelClientePor && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      En espera del cliente por
                    </label>
                    <select
                      value={enEsperaDelClientePor}
                      onChange={(e) =>
                        setEnEsperaDelClientePor(
                          e.target.value === "-None-" ? "" : e.target.value,
                        )
                      }
                      className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar...</option>
                      {esperaClientePor.map((option, index) => (
                        <option
                          key={index}
                          value={option.actual_value || option.display_value}
                        >
                          {option.display_value}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {anticipada === "NO" && (
                  <div className="col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Expliqué por qué no se puede empezar aún
                    </label>
                    <textarea
                      value={comentarioVentaAnticipada}
                      onChange={handleComentarioVentaAnticipadaChange}
                      maxLength={250}
                      rows={3}
                      className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Expliqué por qué no se puede empezar aún"
                    />
                    <span className="text-sm text-gray-500">
                      Caracteres restantes:{" "}
                      {250 - comentarioVentaAnticipadaLength}
                    </span>
                  </div>
                )}

                {mostrarGestionadoBackoffice && (
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="gestionado_backoffice"
                    >
                      Gestionado por backoffice:
                    </label>

                    <select
                      className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      id="gestionado_backoffice"
                      value={
                        gestionadoBackoffice === ""
                          ? "NO"
                          : gestionadoBackoffice
                      }
                      onChange={(e) => {
                        const value =
                          e.target.value === "-None-" ? "" : e.target.value;
                        setGestionadoBackoffice(value);
                      }}
                      required
                    >
                      {backoffice.map((tipo, index) => (
                        <option key={index} value={tipo.display_value}>
                          {tipo.display_value}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b">
                Información de Proyecto
              </h2>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Referencia Cliente
                  </label>
                  <input
                    type="text"
                    value={referenciaCliente}
                    onChange={(e) => setReferenciaCliente(e.target.value)}
                    className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full rounded-md border-2 border-gray-200shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full rounded-md border-2 border-gray-200 shadow-sm bg-gray-50"
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
                    className="w-full rounded-md border-2 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full rounded-md border-2 border-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
