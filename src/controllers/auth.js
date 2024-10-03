const { default: axios } = require('axios');
const { db, admin } = require('../firebase');
const { getDate } = require('../utils/utils');

const signUp = async (req, res) => {
    try {
        const data = req.body;
    
    
       const result = await admin.auth().createUser({
            email: data.email,
            password: data.password,
            displayName: data.fullName,
            phoneNumber: data.phone,
            disabled: false,
            emailVerified: false,
            uid: data.document,
        });


        if(!result) {
            res.send({
                status: false,
                message: 'No se pudo crear el usuario'
            });
        }

        insertUser(result.uid, data);
    
        res.send({
            status: true,
            message: 'Usuario creado correctamente',
            data: result
        });
        
    } catch (error) {
        console.log(error)

        res.status(500).send(error.message || 'Internal server error');
    }

    
}

const signIn = async (req, res) => {
    try {
        const data = req.body;

        try {
            
            const user = await axios.post(`${process.env.URL_SIGNIN}${process.env.API_KEY}`, data);
            console.log(user)
        } catch (error) {

            const { error: errorFirebase } = error.response.data;

            res.send({
                status: false,
                message: errorFirebase.message
            });

            return;

        }
        

        // const token = await admin.auth().verifyIdToken(user.data.idToken, true);
    
        // if(!user) {
        //     res.send({
        //         status: false,
        //         message: 'Usuario no encontrado'
        //     });
        // }

    
        res.send({
            status: true,
            message: 'Usuario encontrado',
            data: user.data
        });
        
    } catch (error) {
        res.status(500).send(error.message || 'Internal server error');
    }
}


/* ---------------FUNCTIONS--------------- */

/**
 * Insert user data in firestore
 * @param {string} uid 
 * @param {object} data 
 */
const insertUser = async (uid, data) => {

    const userData = {
        ...data,
        role: 'USUARIO',
        dtCreation: getDate(),
    }

    await db.collection('users').doc(uid).set(userData);

}

module.exports = { 
    signUp,
    signIn
};