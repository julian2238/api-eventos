const { db, admin } = require("../firebase");

const getEventos = async (req, res) => {
  try {
    const eventosSnap = await db.collection("eventos").get();

    if (eventosSnap.empty) {
      return res.status(200).send({
        status: true,
        message: "No hay eventos registrados",
        eventos: [],
      });
    }

    const eventos = [];
    const tpEventoPromises = [];

    eventosSnap.forEach((doc) => {
      const eventoData = obtenerDataEvento(doc);
      eventos.push(eventoData);

      const tpEventoRef = eventoData.tpEvento;

      if (tpEventoRef && tpEventoRef.path) {
        tpEventoPromises.push(tpEventoRef.get());
      } else {
        tpEventoPromises.push(Promise.resolve(null));
      }
    });

    const tpEventoSnaps = await Promise.all(tpEventoPromises);

    const result = eventos.map((evento, index) => {
      const tpEventoSnap = tpEventoSnaps[index];

      if (tpEventoSnap && tpEventoSnap.exists) {
        return {
          ...evento,
          tpEvento: tpEventoSnap.data().name,
        };
      }
      return evento;
    });

    res.status(200).send({
      status: true,
      message: "Eventos obtenidos correctamente",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

const getEventosById = async (req, res) => {
  try {
    const idEvento = req.params.id;
    if (!idEvento) {
      return res.status(400).send({
        status: false,
        message: "Falta el ID del evento",
      });
    }

    const eventoRef = db.collection("eventos").doc(idEvento);
    const eventoSnap = await eventoRef.get();
    if (!eventoSnap.exists) {
      return res.status(400).send({
        status: false,
        message: "Evento no encontrado",
      });
    }

    const dataEvento = obtenerDataEvento(eventoSnap);

    const tpEventoRef = dataEvento.tpEvento;

    if (tpEventoRef && tpEventoRef.path) {
      const tpEventoSnap = await tpEventoRef.get();
      if (tpEventoSnap && tpEventoSnap.exists) {
        dataEvento.tpEvento = tpEventoSnap.data().name;
      } else {
        dataEvento.tpEvento = null;
      }
    } else {
      dataEvento.tpEvento = null;
    }

    res.status(200).send({
      status: true,
      message: "Evento obtenido correctamente",
      data: dataEvento,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

const participarEvento = async (req, res) => {
  try {
    const { idEvento, idUsuario } = req.body;
    if (!idEvento || !idUsuario) {
      return res.status(400).send({
        status: false,
        message: "Faltan campos requeridos",
      });
    }

    const eventoRef = db.collection("eventos").doc(idEvento);
    const eventoSnap = await eventoRef.get();
    if (!eventoSnap.exists) {
      return res.status(400).send({
        status: false,
        message: "Evento no encontrado",
      });
    }

    const userDocRef = db.collection("users").doc(idUsuario);
    const userSnap = await userDocRef.get();
    if (!userSnap.exists) {
      return res
        .status(400)
        .send({ status: false, message: "Usuario no encontrado" });
    }

    await eventoRef.update({
      participantes: admin.firestore.FieldValue.arrayUnion(idUsuario),
    });

    res.status(200).send({
      status: true,
      message: "Usuario agregado al evento correctamente",
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

const abandonarEvento = async (req, res) => {
  try {
    const { idEvento, idUsuario } = req.body;
    if (!idEvento || !idUsuario) {
      return res.status(400).send({
        status: false,
        message: "Faltan campos requeridos",
      });
    }

    const eventoRef = db.collection("eventos").doc(idEvento);
    const eventoSnap = await eventoRef.get();
    if (!eventoSnap.exists) {
      return res.status(400).send({
        status: false,
        message: "Evento no encontrado",
      });
    }

    const userDocRef = db.collection("users").doc(idUsuario);
    const userSnap = await userDocRef.get();
    if (!userSnap.exists) {
      return res
        .status(400)
        .send({ status: false, message: "Usuario no encontrado" });
    }

    await eventoRef.update({
      participantes: admin.firestore.FieldValue.arrayRemove(idUsuario),
    });

    res.status(200).send({
      status: true,
      message: "Usuario eliminado del evento correctamente",
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

const postEventos = async (req, res) => {
  try {
    const data = req.body;

    validarCampos = (data) => {
      const requiredFields = [
        "tpEvento",
        "nmEvento",
        "date",
        "hour",
        "organizador",
        "ruta",
      ];
      return requiredFields.every((field) => data.hasOwnProperty(field));
    };

    if (!validarCampos(data)) {
      return res.status(400).send({
        status: false,
        message: "Faltan campos requeridos",
      });
    }

    const tpEventoRef = db.collection("tipo_evento").doc(data.tpEvento);
    const tpEventoSnaop = await tpEventoRef.get();

    if (!tpEventoSnaop.exists) {
      return res.status(400).send({
        status: false,
        message: "Tipo de evento no existe",
      });
    }

    const newEvent = {
      tpEvento: tpEventoRef,
      nmEvento: data.nmEvento,
      organizadorEvento: data.organizador,
      rutaEvento: data.ruta,
      participantes: [],
      dtEvento: admin.firestore.Timestamp.fromDate(
        new Date(`${data.date}T${data.hour}:00`)
      ),
      dtCreacion: admin.firestore.Timestamp.now(),
    };

    const docRef = db.collection("eventos").add(newEvent);

    res.status(200).send({
      status: true,
      message: "Evento creado correctamente",
      data: docRef.id,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

const putEventos = (req, res) => {};

const deleteEventos = async (req, res) => {
  try {
    const idEvento = req.params.id;
    if (!idEvento) {
      return res.status(400).send({
        status: false,
        message: "Falta el ID del evento",
      });
    }

    const eventoRef = db.collection("eventos").doc(idEvento);
    const eventoSnap = await eventoRef.get();
    if (!eventoSnap.exists) {
      return res.status(400).send({
        status: false,
        message: "Evento no encontrado",
      });
    }

    await eventoRef.delete();

    res.status(200).send({
      status: true,
      message: "Evento eliminado correctamente",
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

/* ----- FUNCTIONS ----- */

const obtenerDataEvento = (doc) => {
  const eventoData = doc.data();
  const eventoId = doc.id;
  const tpEventoRef = eventoData.tpEvento;

  let fechaEvento = null;
  let horaEvento = null;

  if (
    eventoData.dtEvento &&
    eventoData.dtEvento instanceof admin.firestore.Timestamp
  ) {
    const dateObj = eventoData.dtEvento.toDate();

    fechaEvento = dateObj.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    horaEvento = dateObj.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  delete eventoData.dtEvento;
  delete eventoData.dtCreacion;

  return {
    id: eventoId,
    tpEvento: tpEventoRef,
    fechaEvento,
    horaEvento,
    ...eventoData,
  };
};

module.exports = {
  getEventos,
  getEventosById,
  participarEvento,
  abandonarEvento,
  postEventos,
  putEventos,
  deleteEventos,
};
