import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import FichaSuscriptor from '../suscriptores/FichaSuscriptor';


class LibrosPrestamos extends Component {
        
    state={
        noResultado: false,
        busqueda: '',
        resultado:{}
    }

    //Buscar ALumno por codigo
    buscarAlumno = e =>{
        e.preventDefault();


        // obtener el valor a buscar
        const { busqueda } = this.state;

        // extraer firestore
        const { firestore, buscarUsuario } = this.props;

        // hacer la consulta
        const coleccion = firestore.collection('suscriptores');
        const consulta = coleccion.where("codigo", "==", busqueda).get();

        //leer los resultados
        consulta.then(resultado => {
            if(resultado.empty){
                //no hay resultados
                this.setState({
                    noResultado: true,
                    resultado: {}
                })
            } else{
                //si hay resultado
                const datos=resultado.docs[0]
                this.setState({
                    noResultado: false,
                    resultado : datos.data()
                })
            }
        })




    }
    //almancena los datos del alumno para solicitar un libro
    solicitarPrestamo = () =>{
        const suscriptor = this.state.resultado
        suscriptor.fecha_solicitud = new Date().toLocaleDateString();

        //Obtener el libro

        const libroActualizado = this.props.libro;
        //// agragar el suscriptor al libro

        libroActualizado.prestados.push( suscriptor )

        //obtenemos firestore  e history de los prop
        const { firestore, history, libro } = this.props;

        firestore.update({
            collection: 'libros',
            doc: libro.id

        }, libroActualizado).then(history.push('/'))
    }
    

    //Almacenar en el State
    leerDato= e =>{
        this.setState({
            [e.target.name] : e.target.value
        })
    }


    render() {

        ////extraer el libro de los props
        const {libro} =this.props;
        

        //mostrar el spinner 
        if(!libro) return <Spinner />

        //estraer los valores del alumno
        const { noResultado, resultado } = this.state;

        let fichaAlumno, btnSolicitar;
        if (resultado.nombre){
            fichaAlumno= <FichaSuscriptor 
                            alumno={resultado}
                        />
            btnSolicitar= <button className='btn btn-success btn-block bg-primary mb-5 '
                            onClick={this.solicitarPrestamo}
                        >Solicitar Prestamo</button>
        } else{
            fichaAlumno= null;
            btnSolicitar=null
        }


        return (
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to={'/'} className="btn btn-secondary">
                        <i className="fas fa-arrow-circle-left"></i> {''}
                        Volver al Listado
                    </Link>
                </div>
                <div className="col-12">
                    <h2>
                        <i className="fas fa-book"></i> {''}
                        Solicitar Prestmo : {libro.titulo}
                    </h2>

                    <div className="row justify-content-center mt-5">
                        <div className="col-md-8">

                            <form
                                onSubmit={this.buscarAlumno}
                                className='mb-4'
                            >

                                <legend className='color-red text-center'>
                                    Busca El Suscriptor por Código
                                </legend>
                                <div className="form-group">
                                    <input 
                                        type="text"
                                        className="form-control"
                                        name='busqueda'
                                        onChange={this.leerDato}
                                        
                                    />

                                </div>
                                <input 
                                    type='submit'
                                    value='Buscar Alumno'
                                    className=' btn btn-success btn-success btn-block'
                                />

                            </form>

                            {/*MUESTRA LA FICHA DEL ALUMNO*/}
                            {fichaAlumno}
                            {btnSolicitar}



                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

LibrosPrestamos.propTypes = {
    firestore: PropTypes.object.isRequired
}
 
export default compose(
    firestoreConnect(props => [
        {
            collection : 'libros',
            storeAs : 'libro',
            doc : props.match.params.id
        }
    ]), 
    connect(({ firestore: { ordered }}, props ) => ({
        libro : ordered.libro && ordered.libro[0]
    }))
)(LibrosPrestamos)