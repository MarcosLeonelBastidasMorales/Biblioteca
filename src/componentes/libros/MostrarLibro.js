import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';



class MostrarLibro extends Component {

    devolverLibro= id =>{

        //extraer firestore
        const { firestore } = this.props;

        //tomar una copia  del libro
        const libroActualiza = {...this.props.libro};

        // ELIMINAR A LA PERSONA QUE ESTA REALIZANDO LA DEVOLUCION DE APARTADOS
        const prestados = libroActualiza.prestados.filter(elemento => elemento.codigo !==id )
        libroActualiza.prestados= prestados;

        //actualizar firebase

        firestore.update({
            collection: 'libros',
            doc: libroActualiza.id
        }, libroActualiza)


    }

    render() {
        
        // extraer el libro
        const { libro } = this.props;

        if(!libro) return <Spinner />;

        // boton para solicitar un libro
        let btnPrestamo;

        if(libro.existencia - libro.prestados.length > 0 ) {
            btnPrestamo = <Link to={`/libros/prestamo/${libro.id}`}
                                className="btn btn-success my-3"
                            >--Solicitar Prestamo--</Link>
        } else {
            btnPrestamo = null;
        }


        return (
            <div className="row">
                <div className="col-md-6 mb-4">
                    <Link to='/' className='btn btn-success my-4'>
                        <i className="fas fa-arrow-circle-left"></i> {' '}
                        Volver al Listado
                    </Link>
                </div>

                <div className="col-md-6 mb-4">
                    <Link to= {`/libros/editar/${libro.id}`} className='btn btn-primary float-right'>
                        <i className="fas fa-pencil-alt"></i> {' '}
                        Editar Libro
                    </Link>
                </div>
                <hr className="mx-5 w-100"/>


                <div className="col-12">
                    <h3 className="mb-4 ">{libro.titulo}</h3>
                    <p>
                        <span className='font-weight-bold'>
                            ISBN : 
                        </span>{' '}
                        {libro.ISBN}
                    </p>
                    <p>
                        <span className='font-weight-bold'>
                            Editorial : 
                        </span>{' '}
                        {libro.editorial}
                    </p>
                    <p>
                        <span className='font-weight-bold'>
                            Existencia : 
                        </span>{' '}
                        {libro.existencia }
                    </p>
                    <p>
                        <span className='font-weight-bold'>
                            Disponibles : 
                        </span>{' '}
                        {libro.existencia - libro.prestados.length}
                    </p>
                    {/*BOTON PARA SOLICITAR UN PRESTAMO */}
                    {btnPrestamo}

                    {/* MUESTRA LAS PERSONAS QUE TIENE LOS LIBROS*/}
                    <h3 className="my-3">Personas que tienen el Libro Prestado</h3>
                    {libro.prestados.map(prestado => (
                        <div key={prestado.codigo} className='card my-2'> 
                            <h4 className="card-header">
                                {prestado.nombre} {prestado.apellido}
                            </h4>
                            <div className="car-body">
                                <div className="ml-4 mt-3">
                                    <p>
                                        <span className='font-weight-bold'>
                                            codigo : 
                                        </span>{' '}
                                        {prestado.codigo}
                                    </p>
                                    <p>
                                        <span className='font-weight-bold'>
                                            Carrera : 
                                        </span>{' '}
                                        {prestado.carrera}
                                    </p>
                                    <p>
                                        <span className='font-weight-bold'>
                                            Fecha de Solicitud : 
                                        </span>{' '}
                                        {prestado.fecha_solicitud}
                                    </p>
                                </div>
                            </div>
                            <div className="card-foter">
                                <button
                                    type='button'
                                    className='btn btn-success font-weight bold'
                                    onClick={()=> this.devolverLibro(prestado.codigo) }
                                > Realizar Devolucion</button>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        );
    }
}

MostrarLibro.propTypes={
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
)(MostrarLibro)