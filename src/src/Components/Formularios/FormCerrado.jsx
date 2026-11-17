/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getRecord } from "../../functions/apiFunctions";
import { CgScreen } from "react-icons/cg";

const FormCerrado = ({ registerID, onContinue, onReturn, dts }) => {
  const [currentStep] = React.useState(3);
  const module = dts.data.Entity;
  const rEgisterID = dts.data.EntityId;
  const [loading, setLoading] = useState(false);
  const [newDatos, setNewDatos] = useState(null);
  const [fechasEspecificas, setechasEspecificas] = useState("");
  const [algoHecho, setAlgoHecho] = useState("");
  const [cuantasPaginas, setCuantasPaginas] = useState(0);
  const [paginaCorrecciones, setPaginaCorrecciones] = useState(0);
  const [porcentajeCorrecciones, setPorcentajeCorrecciones] = useState("");
  const [porcentajeDePlagio, setPorcentajeDePlagio] = useState(0);
  const [acuerdoPagos, setAcuerdoPagos] = useState(0);
  const [informacionAportada, setInformacionAportada] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [trabajoDeCampo, setTrabajoDeCampo] = useState("");
  const [tieneIndice, setTieneIndice] = useState("");
  const [especificas, setEspecificas] = useState("");
  const [algoValidado, setAlgoValidado] = useState("");
  const [aplicarCorrecciones, setAplicarCorrecciones] = useState("");
  const [paginasNuevas, setPaginasNuevas] = useState(0);
  const [habladoSobre, setHabladoSobre] = useState("");
  const [cantidadDeAdjuntos, setCantidadDeAdjuntos] = useState(0);
  const [tipoDeTrabajo, setTipoDeTrabajo] = useState("");
  const [tipoDeInvestigacion, setTipoDeInvestigacion] = useState("");
  const [comentarioCerrado, setComentarioCerrado] = useState("");
  const [comentarioCLiente, setComentarioCliente] = useState("");
  const [tratoTildado, setTratoTildado] = useState(null);
  const [fields, setFields] = useState([]);
  const [comentarioCerradoLength, setComentarioCerradoLength] = useState(0);
  const [comentarioClienteLength, setComentarioClienteLength] = useState(0);
  const [fechaMasProxioma, setFechaMasProxima] = useState("");
  const [npOtros, setNpOtros] = useState("");
  const [formData, setFormData] = useState({
    id: registerID,
    Tiene_fechas_espec_ficas: "",
    Tiene_algo_hecho_el_cliente: "",
    Cu_ntas_p_ginas_aporta_el_cliente: "",
    Cu_ntas_p_ginas_son_de_correcciones: "",
    Porcentaje_de_plagio_de_lo_que_tenga_hecho: "",
    Qu_has_acordado_sobre_los_pagos_entregas: "",
    El_cliente_ha_aportado_toda_la_informaci_n_o_a_n: "",
    Tiene_trabajo_de_campo: "",
    El_cliente_tiene_un_indice_que_debe_seguirse_LA: "",
    Cu_les_son_las_fechas_espec_ficas_2: "",
    Tiene_algo_validado: "",
    Hay_que_aplicar_correcciones: "",
    Cu_ntas_p_ginas_son_nuevas: "",
    Has_hablado_con_el_cliente_sobre_la_cantidad_de_e: "",
    Cantidad_de_adjuntos: "",
    Tipo_de_trabajo_np: "",
    Tipo_de_investigaci_n_np: "",
    Comentario_cerrado_nuevas_pautas: "",
    Comentarios_Cliente: "", // Corregido aquí el nombre del estado
  });

  const [buttonOn, SetButtonOn] = useState(false);

  //funcion que trae la info del modulo al cargar la pagina y los setea en la variable newDatos
  useEffect(() => {
    getRecord(module, rEgisterID)
      .then(function (result) {
        const datos = result.register;
        console.log("datos", datos);

        setNewDatos(datos);
      })
      .catch(function (error) {
        // console.error(error);
      });
  }, [module, rEgisterID]);
  // funcion para traer todos los campos del elemento
  const getFields = (entrity) => {
    return new Promise(function (resolve, reject) {
      window.ZOHO.CRM.META.getFields({ Entity: "Deals" })
        .then(function (response) {
          setFields(response.fields);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  };
  // asignacion de los valores a los campos dependiendo si llegaron los datos , se ejecuta al iniciar
  useEffect(() => {
    getFields();

    if (newDatos) {
      setTratoTildado(newDatos.Trato_Latam_enviado_a_coordinacion || "");
      setechasEspecificas(newDatos.Tiene_fechas_espec_ficas || "");
      setAlgoHecho(newDatos.Tiene_algo_hecho_el_cliente || "");
      setCuantasPaginas(newDatos.Cu_ntas_p_ginas_aporta_el_cliente || 0);
      setPaginaCorrecciones(newDatos.Cu_ntas_p_ginas_son_de_correcciones || 0);
      setPorcentajeCorrecciones(newDatos.porcentajeCorrecciones || "");
      setPorcentajeDePlagio(
        newDatos.Porcentaje_de_plagio_de_lo_que_tenga_hecho || 0
      );
      setAcuerdoPagos(newDatos.Qu_has_acordado_sobre_los_pagos_entregas || "");
      setInformacionAportada(
        newDatos.El_cliente_ha_aportado_toda_la_informaci_n_o_a_n || ""
      );
      setTrabajoDeCampo(newDatos.Tiene_trabajo_de_campo || "");
      setTieneIndice(
        newDatos.El_cliente_tiene_un_indice_que_debe_seguirse_LA || ""
      );

      setEspecificas(newDatos.Cu_les_son_las_fechas_espec_ficas_2 || "");
      setAlgoValidado(newDatos.Tiene_algo_validado || "");
      setAplicarCorrecciones(newDatos.Hay_que_aplicar_correcciones || "");
      setPaginasNuevas(newDatos.Cu_ntas_p_ginas_son_nuevas || 0);
      setHabladoSobre(
        newDatos.Has_hablado_con_el_cliente_sobre_la_cantidad_de_e || ""
      );
      setCantidadDeAdjuntos(newDatos.Cantidad_de_adjuntos || 0);
      setTipoDeTrabajo(newDatos.Tipo_de_trabajo_np || "");
      setTipoDeInvestigacion(newDatos.Tipo_de_investigaci_n_np || "");
      setComentarioCerrado(newDatos.Comentario_cerrado_nuevas_pautas || "");
      setComentarioCliente(newDatos.Comentarios_Cliente || "");
      setNpOtros(newDatos.Tipo_de_trabajo_np_Otros);
      if (tipoDeTrabajo !== "Otros") {
        setNpOtros(""); // Establece npOtros en blanco si tipoDeTrabajo ya no es "Otros"
      }
      setFechaMasProxima(newDatos.Fecha_especifica_mas_proxima);
    }
  }, [newDatos]);

  // seteo de los datos del form con las variables que ya estaba antes
  useEffect(() => {
    setFormData({
      ...formData,
      Tiene_fechas_espec_ficas: fechasEspecificas,
      Tiene_algo_hecho_el_cliente: algoHecho,
      Cu_ntas_p_ginas_aporta_el_cliente: cuantasPaginas,
      Cu_ntas_p_ginas_son_de_correcciones: paginaCorrecciones,
      Porcentaje_de_plagio_de_lo_que_tenga_hecho: porcentajeDePlagio,
      Qu_has_acordado_sobre_los_pagos_entregas: acuerdoPagos,
      El_cliente_ha_aportado_toda_la_informaci_n_o_a_n: informacionAportada,
      Tiene_trabajo_de_campo: trabajoDeCampo,
      l_cliente_tiene_un_indice_que_debe_seguirse: tieneIndice,
      Cu_les_son_las_fechas_espec_ficas_2: especificas,
      Tiene_algo_validado: algoValidado,
      Hay_que_aplicar_correcciones: aplicarCorrecciones,
      Cu_ntas_p_ginas_son_nuevas: paginasNuevas,
      Has_hablado_con_el_cliente_sobre_la_cantidad_de_e: habladoSobre,
      El_cliente_tiene_un_indice_que_debe_seguirse_LA: tieneIndice,
      Cantidad_de_adjuntos: cantidadDeAdjuntos,
      Tipo_de_trabajo_np: tipoDeTrabajo,
      Tipo_de_investigaci_n_np: tipoDeInvestigacion,
      Comentario_cerrado_nuevas_pautas: comentarioCerrado,
      Comentarios_Cliente: comentarioCLiente, // Corregido aquí el nombre del estado
      Enviar_trato_a_coordinacion: true,
      Fecha_especifica_mas_proxima: fechaMasProxioma,
      Tipo_de_trabajo_np_Otros: npOtros,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fechasEspecificas,
    algoHecho,
    cuantasPaginas,
    paginaCorrecciones,
    porcentajeDePlagio,
    acuerdoPagos,
    informacionAportada,
    trabajoDeCampo,
    tieneIndice,
    especificas,
    algoValidado,
    aplicarCorrecciones,
    paginasNuevas,
    habladoSobre,
    cantidadDeAdjuntos,
    tipoDeTrabajo,
    tipoDeInvestigacion,
    comentarioCerrado,
    comentarioCLiente,
    fechaMasProxioma,
    npOtros,
  ]);
  console.log(tratoTildado);

  // funcion para traer los campos desplegables y filtrarlos

  const getFieldValues = (fields, apiName) => {
    const field = fields.find((item) => item.api_name === apiName);
    return field ? field.pick_list_values || [] : [];
  };

  const fechas = getFieldValues(fields, "Tiene_fechas_espec_ficas");
  const algo = getFieldValues(fields, "Tiene_algo_hecho_el_cliente");
  const validado = getFieldValues(fields, "Tiene_algo_validado");
  const aplicarCorreccion = getFieldValues(
    fields,
    "Hay_que_aplicar_correcciones"
  );
  const hablado = getFieldValues(
    fields,
    "Has_hablado_con_el_cliente_sobre_la_cantidad_de_e"
  );
  const trabajonp = getFieldValues(fields, "Tipo_de_trabajo_np");
  const investigacionnp = getFieldValues(fields, "Tipo_de_investigaci_n_np");
  const aportado = getFieldValues(
    fields,
    "El_cliente_ha_aportado_toda_la_informaci_n_o_a_n"
  );
  const tcampo = getFieldValues(fields, "Tiene_trabajo_de_campo");

  // funcion SDK soho para actualizar un elemento

  const config = {
    Entity: "Deals",
    APIData: formData,
    Trigger: ["workflow"],
  };

  async function updateRecord(config) {
    try {
      const data = await window.ZOHO.CRM.API.updateRecord(config);

      return data;
    } catch (error) {
      console.error(error);
      throw error; // Rechaza la promesa con el error para que pueda ser capturado externamente
    }
  }

  //funcion para guardar los cambios
  const guardarDatos = () => {
    updateRecord(config)
      .then((resultado) => {
        // Actualiza el estado local con los nuevos datos
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...resultado.data, // Asegúrate de que la respuesta del servidor tenga los datos actualizados
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
        // window.location.reload();
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

  // funcion submit para activar el guardado de datos

  const handleSubmitRedirect = (event) => {
    event.preventDefault();
    if (isDisabled) {
      return; // Evita que el botón se presione nuevamente si ya está deshabilitado
    }

    const camposVacios = [
      fechasEspecificas === null ||
        fechasEspecificas === undefined ||
        fechasEspecificas === "",
      (fechaMasProxioma === null ||
        fechaMasProxioma === undefined ||
        fechaMasProxioma === "") &&
        fechasEspecificas === "Sí",
      (especificas === null ||
        especificas === undefined ||
        especificas === "") &&
        fechasEspecificas === "Sí",
      algoHecho === null || algoHecho === undefined || algoHecho === "",
      cuantasPaginas === null ||
        cuantasPaginas === undefined ||
        cuantasPaginas === "",
      paginaCorrecciones === null ||
        paginaCorrecciones === undefined ||
        paginaCorrecciones === "",
      porcentajeDePlagio === null ||
        porcentajeDePlagio === undefined ||
        porcentajeDePlagio === "",
      acuerdoPagos === null ||
        acuerdoPagos === undefined ||
        acuerdoPagos === "",
      informacionAportada === null ||
        informacionAportada === undefined ||
        informacionAportada === "",
      trabajoDeCampo === null ||
        trabajoDeCampo === undefined ||
        trabajoDeCampo === "",
      tieneIndice === null || tieneIndice === undefined || tieneIndice === "",
      algoValidado === null ||
        algoValidado === undefined ||
        algoValidado === "",
      aplicarCorrecciones === null ||
        aplicarCorrecciones === undefined ||
        aplicarCorrecciones === "",
      paginasNuevas === null ||
        paginasNuevas === undefined ||
        paginasNuevas === "",
      habladoSobre === null ||
        habladoSobre === undefined ||
        habladoSobre === "",
      cantidadDeAdjuntos === null ||
        cantidadDeAdjuntos === undefined ||
        cantidadDeAdjuntos === "",
      tipoDeTrabajo === null ||
        tipoDeTrabajo === undefined ||
        tipoDeTrabajo === "",
      tipoDeTrabajo === "Otros"
        ? npOtros === null || npOtros === undefined || npOtros === ""
        : null,
      tipoDeInvestigacion === null ||
        tipoDeInvestigacion === undefined ||
        tipoDeInvestigacion === "",
      comentarioCerrado === undefined || comentarioCerrado === "",
    ];

    const nombresCampos = [
      "¿Tiene fechas específicas?",
      "¿Cuáles es la fechas específica más próxima?",
      "Comentario de fechas específicas",
      "¿Tiene algo hecho el cliente?",
      "¿Cuántas páginas aporta el cliente?",
      "¿Cuántas páginas son de correcciones?",
      "¿Porcentaje de plagio de lo que tenga hecho?",
      "¿Qué has acordado sobre los pagos/entregas?",
      "¿El cliente ha aportado toda la información o aún no?",
      "¿Tiene trabajo de campo?",
      "¿El cliente tiene un índice que debe seguirse?",
      "¿Tiene algo validado?",
      "¿Hay que aplicar correcciones?",
      "¿Cuántas páginas son nuevas?",
      "¿Has hablado con el cliente sobre la cantidad de entregas?",
      "Cantidad de adjuntos",
      "Tipo de trabajo",
      "Especifique otro tipo de trabajo",
      "Comentario cerrado",
    ];

    const campoFaltanteIndex = camposVacios.findIndex((campo) => campo);

    // Verifica si algún campo está vacío
    if (campoFaltanteIndex !== -1) {
      // Muestra un mensaje de error indicando qué campo falta completar
      Swal.fire({
        title: `Complete ${nombresCampos[campoFaltanteIndex]} `,
        text: "",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
      return; // Evita que el formulario se envíe si hay campos vacíos
    }

    // Desactiva el botón al iniciar el proceso
    setIsDisabled(true);

    try {
      // Si todos los campos están completos, procede a guardar y continuar
      guardarDatos(); // Ejecuta la función para guardar los datos
      onContinue(); // Continúa con el siguiente paso
    } catch (error) {
      console.error("Error al guardar o continuar:", error);
    } finally {
      // Reactiva el botón después de completar la operación
      setIsDisabled(false);
    }
  };

  const handleSave = async (event) => {
    if (loading || isDisabled) {
      return;
    }
    event.preventDefault();

    const camposVacios = [
      fechasEspecificas === null ||
        fechasEspecificas === undefined ||
        fechasEspecificas === "",
      (especificas === null ||
        especificas === undefined ||
        especificas === "") &&
        fechasEspecificas === "Sí",
      algoHecho === null || algoHecho === undefined || algoHecho === "",
      cuantasPaginas === null ||
        cuantasPaginas === undefined ||
        cuantasPaginas === "",
      paginaCorrecciones === null ||
        paginaCorrecciones === undefined ||
        paginaCorrecciones === "",
      porcentajeDePlagio === null ||
        porcentajeDePlagio === undefined ||
        porcentajeDePlagio === "",
      acuerdoPagos === null ||
        acuerdoPagos === undefined ||
        acuerdoPagos === "",
      informacionAportada === null ||
        informacionAportada === undefined ||
        informacionAportada === "",
      trabajoDeCampo === null ||
        trabajoDeCampo === undefined ||
        trabajoDeCampo === "",
      tieneIndice === null || tieneIndice === undefined || tieneIndice === "",
      algoValidado === null ||
        algoValidado === undefined ||
        algoValidado === "",
      aplicarCorrecciones === null ||
        aplicarCorrecciones === undefined ||
        aplicarCorrecciones === "",
      paginasNuevas === null ||
        paginasNuevas === undefined ||
        paginasNuevas === "",
      habladoSobre === null ||
        habladoSobre === undefined ||
        habladoSobre === "",
      cantidadDeAdjuntos === null ||
        cantidadDeAdjuntos === undefined ||
        cantidadDeAdjuntos === "",
      tipoDeTrabajo === null ||
        tipoDeTrabajo === undefined ||
        tipoDeTrabajo === "",
      tipoDeInvestigacion === null ||
        tipoDeInvestigacion === undefined ||
        tipoDeInvestigacion === "",
      comentarioCerrado === undefined || comentarioCerrado === "",
    ];

    const nombresCampos = [
      "¿Tiene fechas específicas?",
      "¿Cuáles son las fechas específicas?",
      "¿Tiene algo hecho el cliente?",
      "¿Cuántas páginas aporta el cliente?",
      "¿Cuántas páginas son de correcciones?",
      "¿Porcentaje de plagio de lo que tenga hecho?",
      "¿Qué has acordado sobre los pagos/entregas?",
      "¿El cliente ha aportado toda la información o aún no?",
      "¿Tiene trabajo de campo?",
      "El cliente tiene un indice que debe seguirse?",
      "¿Tiene algo validado?",
      "¿Hay que aplicar correcciones?",
      "¿Cuántas páginas son nuevas?",
      "¿Has hablado con el cliente sobre la cantidad de entregas?",
      "Cantidad de adjuntos",
      "Tipo de trabajo np",
      "Comentario cerrado np",
      // "Comentario Cliente",
    ];
    const campoFaltanteIndex = camposVacios.findIndex((campo) => campo);

    if (fechasEspecificas === "Sí" && !especificas) {
      camposVacios.push(true);
    }
    // Verifica si algún campo está vacío
    if (campoFaltanteIndex !== -1) {
      // Muestra un mensaje de error indicando qué campo falta completar
      Swal.fire({
        title: `Complete ${nombresCampos[campoFaltanteIndex]} `,
        text: "",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
      return; // Evita que el formulario se envíe si hay campos vacíos
    }
    try {
      setLoading(true);
      setIsDisabled(true);

      guardarDatos();
      await window.ZOHO.CRM.BLUEPRINT.proceed();
    } catch (error) {
      console.error("Error al guardar o continuar:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al procesar la solicitud",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
    }
  };

  // funcion para cerrar el widget y actualizar datos
  const cerrarWidget = async () => {
    const camposVacios = [
      fechasEspecificas === null ||
        fechasEspecificas === undefined ||
        fechasEspecificas === "",
      (especificas === null ||
        especificas === undefined ||
        especificas === "") &&
        fechasEspecificas === "Sí",
      algoHecho === null || algoHecho === undefined || algoHecho === "",
      cuantasPaginas === null ||
        cuantasPaginas === undefined ||
        cuantasPaginas === "",
      paginaCorrecciones === null ||
        paginaCorrecciones === undefined ||
        paginaCorrecciones === "",
      porcentajeDePlagio === null ||
        porcentajeDePlagio === undefined ||
        porcentajeDePlagio === "",
      acuerdoPagos === null ||
        acuerdoPagos === undefined ||
        acuerdoPagos === "",
      informacionAportada === null ||
        informacionAportada === undefined ||
        informacionAportada === "",
      trabajoDeCampo === null ||
        trabajoDeCampo === undefined ||
        trabajoDeCampo === "",
      tieneIndice === null || tieneIndice === undefined || tieneIndice === "",
      algoValidado === null ||
        algoValidado === undefined ||
        algoValidado === "",
      aplicarCorrecciones === null ||
        aplicarCorrecciones === undefined ||
        aplicarCorrecciones === "",
      paginasNuevas === null ||
        paginasNuevas === undefined ||
        paginasNuevas === "",
      habladoSobre === null ||
        habladoSobre === undefined ||
        habladoSobre === "",
      cantidadDeAdjuntos === null ||
        cantidadDeAdjuntos === undefined ||
        cantidadDeAdjuntos === "",
      tipoDeTrabajo === null ||
        tipoDeTrabajo === undefined ||
        tipoDeTrabajo === "",
      tipoDeInvestigacion === null ||
        tipoDeInvestigacion === undefined ||
        tipoDeInvestigacion === "",
    ];

    const nombresCampos = [
      "¿Tiene fechas específicas?",
      "¿Cuáles son las fechas específicas?",
      "¿Tiene algo hecho el cliente?",
      "¿Cuántas páginas aporta el cliente?",
      "¿Cuántas páginas son de correcciones?",
      "¿Porcentaje de plagio de lo que tenga hecho?",
      "¿Qué has acordado sobre los pagos/entregas?",
      "¿El cliente ha aportado toda la información o aún no?",
      "¿Tiene trabajo de campo?",
      "El cliente tiene un indice que debe seguirse?",
      "¿Tiene algo validado?",
      "¿Hay que aplicar correcciones?",
      "¿Cuántas páginas son nuevas?",
      "¿Has hablado con el cliente sobre la cantidad de entregas?",
      "Cantidad de adjuntos",
      "Tipo de trabajo np",
      "Comentario cerrado np",
      // "Comentario Cliente",
    ];
    const campoFaltanteIndex = camposVacios.findIndex((campo) => campo);

    if (fechasEspecificas === "Sí" && !especificas) {
      camposVacios.push(true);
    }
    // Verifica si algún campo está vacío
    if (campoFaltanteIndex !== -1) {
      // Muestra un mensaje de error indicando qué campo falta completar
      Swal.fire({
        title: `Complete ${nombresCampos[campoFaltanteIndex]} `,
        text: "",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
      return; // Evita que el formulario se envíe si hay campos vacíos
    }

    setLoading(true);

    try {
      // Guarda los datos
      await guardarDatos();

      // Ejecuta el código externo
      let func_name = "CreateProyectInCoordinacion";
      let req_data = {
        arguments: JSON.stringify({
          dealID: rEgisterID,
        }),
      };

      getRecord(module, rEgisterID)
        .then(function (result) {
          const datos = result.register;
        })
        .catch(function (error) {
          // console.error(error);
        });

      try {
        const res = await window.ZOHO.CRM.FUNCTIONS.execute(
          func_name,
          req_data
        );
      } catch (error) {
        console.log(console.error());
      }

      // Procede con el blueprint
      window.ZOHO.CRM.BLUEPRINT.proceed();

      // Cierra el widget después de que se hayan completado todas las operaciones
      await window.ZOHO.CRM.UI.Popup.closeReload();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  //funcion pora limitar caracteres y espacios de los textArea

  const handleComentarioCerradoChange = (e) => {
    const inputValue = e.target.value;
    // Limitar la longitud del comentario a 1900 caracteres
    if (inputValue.length <= 1900) {
      setComentarioCerrado(inputValue);
      setComentarioCerradoLength(inputValue.length);
    }
  };
  const handleComentarioClienteChange = (e) => {
    const inputValue = e.target.value;
    // Limitar la longitud del comentario a 1900 caracteres
    if (inputValue.length <= 25000) {
      setComentarioCliente(inputValue);
      setComentarioClienteLength(inputValue.length);
    }
  };

  //funcion para mostar o no y limpiar el campo fechas especificas

  const handleFechasEspecificasChange = (e) => {
    if (e.target.value === "-None-") {
      setechasEspecificas("");
    } else {
      setechasEspecificas(e.target.value);
    }

    // Limpiar el campo de fechas específicas si el valor cambia a "No"
    if (e.target.value === "No") {
      setEspecificas("");
    }
  };

  //funcion pora volver al componente anterior

  const backTo = (event) => {
    event.preventDefault();
    onReturn();
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
                Cerrado nuevas pautas
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
                onClick={handleSubmitRedirect}
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
                Información General
              </h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    ¿Tiene fechas específicas?
                  </label>
                  <select
                    value={fechasEspecificas}
                    onChange={handleFechasEspecificasChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {fechas.map((option) => (
                      <option
                        key={option.actual_value}
                        value={option.actual_value}
                      >
                        {option.display_value}
                      </option>
                    ))}
                  </select>
                </div>
                {fechasEspecificas === "Sí" && (
                  <div className="slot">
                    <label
                      htmlFor="cualesFechasEspecificas"
                      className="block text-sm font-medium text-gray-700 mb-4"
                    >
                      Comentario fechas especificas
                    </label>
                    <input
                      type="text"
                      id="cualesFechasEspecificas"
                      value={especificas}
                      maxLength={200}
                      onChange={(e) => setEspecificas(e.target.value)}
                      required={fechasEspecificas === "si"}
                      className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                    />
                  </div>
                )}
                {fechasEspecificas === "Sí" && (
                  <div className="slot">
                    <label
                      htmlFor="cualesFechasEspecificas"
                      className="block text-sm font-medium text-gray-700 mb-4"
                    >
                      Fecha específica mas proxima
                    </label>
                    <input
                      type="date"
                      id="fechaMasProxioma"
                      value={fechaMasProxioma}
                      onChange={(e) => setFechaMasProxima(e.target.value)}
                      required={fechaMasProxioma === "si"}
                      className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                    />
                  </div>
                )}
                <div className="slot">
                  <label
                    htmlFor="algoHecho"
                    className="block text-sm font-medium text-gray-700 mb-4"
                  >
                    ¿Tiene algo hecho el cliente?
                  </label>
                  <select
                    id="algoHecho"
                    value={algoHecho}
                    onChange={(e) => {
                      const value =
                        e.target.value === "-None-" ? "" : e.target.value;
                      setAlgoHecho(value);
                    }}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {algo.map((tipo, index) => (
                      <option key={index} value={tipo.display_value}>
                        {tipo.display_value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="slot">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="algoValidado"
                  >
                    ¿Tiene algo validado?
                  </label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    id="algoValidado"
                    value={algoValidado}
                    onChange={(e) => {
                      const value =
                        e.target.value === "-None-" ? "" : e.target.value;
                      setAlgoValidado(value);
                    }}
                    required
                  >
                    {validado.map((tipo, index) => (
                      <option key={index} value={tipo.display_value}>
                        {tipo.display_value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="slot">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="referenciatieneIndice"
                  >
                    ¿Cuántas páginas aporta el cliente?
                  </label>
                  <input
                    type="number"
                    id="fechaContratacion"
                    value={cuantasPaginas}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setCuantasPaginas(e.target.value)}
                    required
                    className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>
                <div className="slot">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="aplicarCorrecciones"
                  >
                    ¿Hay que aplicar correcciones?
                  </label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    id="aplicarCorrecciones"
                    value={aplicarCorrecciones}
                    onChange={(e) => {
                      const value =
                        e.target.value === "-None-" ? "" : e.target.value;
                      setAplicarCorrecciones(value);
                    }}
                    required
                  >
                    {aplicarCorreccion.map((tipo, index) => (
                      <option key={index} value={tipo.display_value}>
                        {tipo.display_value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="slot">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="paginaCorrecciones"
                  >
                    ¿Cuántas páginas son de correcciones?
                  </label>
                  <input
                    type="number"
                    id="fechaContratacion"
                    value={paginaCorrecciones}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setPaginaCorrecciones(e.target.value)}
                    required
                    className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>
                <div className="slot">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="porcentajeCorrecciones"
                  >
                    ¿Cuántas páginas son nuevas?
                  </label>
                  <input
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    id="porcentajeCorrecciones"
                    value={paginasNuevas}
                    onChange={(e) => setPaginasNuevas(e.target.value)}
                    required
                    className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>

                <div className="slot">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="porcentajeDePlagio"
                  >
                    ¿Porcentaje de plagio de lo que tenga hecho?
                  </label>
                  <input
                    type="number"
                    id="porcentajeDePlagio"
                    onWheel={(e) => e.target.blur()}
                    value={porcentajeDePlagio}
                    onChange={(e) => setPorcentajeDePlagio(e.target.value)}
                    required
                    className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>
                <div className="slot">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="habladoSobre"
                  >
                    ¿Has hablado con el cliente sobre la cantidad de entregas?
                  </label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    id="habladoSobre"
                    value={habladoSobre}
                    onChange={(e) => {
                      const value =
                        e.target.value === "-None-" ? "" : e.target.value;
                      setHabladoSobre(value);
                    }}
                    required
                  >
                    {hablado.map((tipo, index) => (
                      <option key={index} value={tipo.display_value}>
                        {tipo.display_value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="slot">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="acuerdoPagos"
                  >
                    ¿Qué has acordado sobre las entregas ?
                  </label>
                  <input
                    type="text"
                    id="acuerdoPagos"
                    value={acuerdoPagos}
                    onChange={(e) => setAcuerdoPagos(e.target.value)}
                    required
                    className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>
                <div className="slot">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="cantidadDeAdjuntos"
                  >
                    Cantidad de adjuntos
                  </label>
                  <input
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    id="fechaContratacion"
                    value={cantidadDeAdjuntos}
                    onChange={(e) => setCantidadDeAdjuntos(e.target.value)}
                    required
                    className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>
                <div className="slot">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="informacionAportada"
                  >
                    ¿Debe el cliente enviar mas informacion?
                  </label>
                  <select
                    id="informacionAportada"
                    value={informacionAportada}
                    onChange={(e) => {
                      const value =
                        e.target.value === "-None-" ? "" : e.target.value;
                      setInformacionAportada(value);
                    }}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {aportado.map((tipo, index) => (
                      <option key={index} value={tipo.display_value}>
                        {tipo.display_value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="slot">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="tipoDeTrabajo"
                  >
                    Tipo de trabajo np
                  </label>
                  <select
                    id="tipoDeTrabajo"
                    value={tipoDeTrabajo}
                    onChange={(e) => {
                      const value =
                        e.target.value === "-None-" ? "" : e.target.value;
                      setTipoDeTrabajo(value);
                      setNpOtros("");
                    }}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {trabajonp.map((tipo, index) => (
                      <option key={index} value={tipo.display_value}>
                        {tipo.display_value}
                      </option>
                    ))}
                  </select>
                </div>
                {tipoDeTrabajo === "Otros" && (
                  <div className="slot">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-4"
                      htmlFor="npOtros"
                    >
                      Especifique Otro tipo de trabajo
                    </label>
                    <input
                      type="text"
                      id="npOtros"
                      value={npOtros}
                      onChange={(e) => setNpOtros(e.target.value)}
                      required={npOtros === "si"}
                      className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                    />
                  </div>
                )}
                <div className="slot">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="trabajoDeCampo"
                  >
                    ¿Tiene trabajo de campo?
                  </label>
                  <select
                    id="trabajoDeCampo"
                    value={trabajoDeCampo}
                    onChange={(e) => {
                      const value =
                        e.target.value === "-None-" ? "" : e.target.value;
                      setTrabajoDeCampo(value);
                    }}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {tcampo.map((tipo, index) => (
                      <option key={index} value={tipo.display_value}>
                        {tipo.display_value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="slot">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="tipoDeInvestigacion"
                  >
                    Tipo de trabajo de campo:
                  </label>
                  <select
                    id="tipoDeInvestigacion"
                    value={tipoDeInvestigacion}
                    onChange={(e) => {
                      const value =
                        e.target.value === "-None-" ? "" : e.target.value;
                      setTipoDeInvestigacion(value);
                    }}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {investigacionnp.map((tipo, index) => (
                      <option key={index} value={tipo.display_value}>
                        {tipo.display_value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="slot">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="tieneIndice"
                  >
                    El cliente tiene un indice que debe seguirse?
                  </label>
                  <input
                    type="text"
                    id="tieneIndice"
                    value={tieneIndice}
                    onChange={(e) => setTieneIndice(e.target.value)}
                    required
                    className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                  />
                </div>
                <div className="slot text">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="comentarioCerrado"
                  >
                    Comentarios Cliente
                  </label>
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    id="comentarioCLiente"
                    value={comentarioCLiente}
                    onChange={handleComentarioClienteChange}
                    required
                    maxLength={25000} // Limitar la cantidad máxima de caracteres
                    rows={Math.ceil(comentarioCerradoLength / 100)} // Calcular las filas en base a la longitud del comentario
                  />
                  <span className="text-sm text-gray-500">
                    Caracteres restantes: {25000 - comentarioClienteLength}
                  </span>
                </div>
                <div className="slot text">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-4"
                    htmlFor="comentarioCerrado"
                  >
                    Comentario cerrado np
                  </label>
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    id="comentarioCerrado"
                    value={comentarioCerrado}
                    onChange={handleComentarioCerradoChange}
                    required
                    maxLength={1900} // Limitar la cantidad máxima de caracteres
                    rows={Math.ceil(comentarioCerradoLength / 100)} // Calcular las filas en base a la longitud del comentario
                  />
                  <span className="text-sm text-gray-500">
                    Caracteres restantes: {1900 - comentarioCerradoLength}
                  </span>
                </div>
                {/* Add other fields following the same pattern */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormCerrado;
