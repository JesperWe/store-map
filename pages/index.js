import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { fabric } from 'fabric'
import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	HStack
} from "@chakra-ui/react"

let canvas

const departments = [
	{
		key: 'fotball',
		name: 'Fotball',
		color: '#ff6400'
	},
	{
		key: 'bikes',
		name: 'Bikes',
		color: '#ffca00'
	},
	{
		key: 'weapons',
		name: 'Weapons',
		color: '#cbfa00'
	},
	{
		key: 'pickup',
		name: 'Pickup@Store',
		color: '#02fa7d'
	},
	{
		key: 'cust-serv',
		name: 'Customer Service',
		color: '#02c6fa'
	},
]

export default function Home() {

	const [ target, set_target ] = useState()
	const [ category, set_category ] = useState()
	const [ isOpen, set_isOpen ] = useState( false )

	const addRect = c => {
		const dept = departments.find( d => d.key === category )

		const rect = new fabric.Rect( {
			height: 280,
			width: 200,
			opacity: 0.5,
			fill: dept.color
		} )
		const text = new fabric.Text( dept.name, {
			fontSize: 30,
			originX: 'center',
			originY: 'center',
			top: 140,
			left: 100
		} )
		const group = new fabric.Group( [ rect, text ], {
			left: 150,
			top: 100
		} )
		c.add( group )
		c.renderAll()
	}

	useEffect( () => {
		canvas = new fabric.Canvas( 'canvas', {
			height: 800,
			width: 1200,
			backgroundColor: '#eeeeee',
		} )

		fabric.Image.fromURL( "/kungenskurva.png", img => {
			canvas.setBackgroundImage( img, canvas.renderAll.bind( canvas ), {
				scaleX: canvas.width / img.width,
				scaleY: canvas.width / img.width
			} )
		} )
		canvas.on( 'mouse:dblclick', e => {
			set_target( e.target )
			set_isOpen( true )
		} )
		canvas.on( {
			'object:scaling': obj => {
				const text = obj.target.item( 1 ),
					group = obj.target,
					scaleX = group.width / ( group.width * group.scaleX ),
					scaleY = group.height / ( group.height * group.scaleY )
				text.set( 'scaleX', scaleX )
				text.set( 'scaleY', scaleY )
			}
		} )
	}, [] )

	return (
		<div className={ styles.container }>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app"/>
				<link rel="icon" href="/favicon.ico"/>
			</Head>

			<main className={ styles.main }>
				<HStack>
					<Select
						placeholder="Select department"
						onChange={ e => set_category(e.target.value) }
					>
						{ departments.map( d => ( <option key={ d.key } value={ d.key }>{ d.name }</option> ) ) }
					</Select>

					<Button onClick={ () => addRect( canvas ) }>Add Area</Button>

				</HStack>
				<canvas style={ { marginTop: 12 } } id="canvas"/>
			</main>

			<Modal isOpen={ isOpen } onClose={ () => set_isOpen( false ) }>
				<ModalOverlay/>
				<ModalContent>
					<ModalHeader>Store area info</ModalHeader>
					<ModalCloseButton/>
					<ModalBody>
						<Select
							placeholder="Select department"
							onChange={ e => {
								const dept = departments.find( d => d.key === e.target.value )
								target.item( 1 )?.set( 'text', dept.name )
								target.item( 0 )?.set( 'backgroundColor', dept.color )
								canvas.renderAll()
							} }
						>
							{ departments.map( d => ( <option key={ d.key } value={ d.key }>{ d.name }</option> ) ) }
						</Select>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" mr={ 3 } onClick={ () => set_isOpen( false ) }>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

		</div>
	)
}
