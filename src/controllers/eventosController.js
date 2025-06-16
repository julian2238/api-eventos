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

      eventos.push({
        id: eventoId,
        tpEvento: "",
        fechaEvento,
        horaEvento,
        ...eventoData,
      });

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

const getEventosById = (req, res) => {};

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

const deleteEventos = (req, res) => {};

module.exports = {
  getEventos,
  getEventosById,
  postEventos,
  putEventos,
  deleteEventos,
};
