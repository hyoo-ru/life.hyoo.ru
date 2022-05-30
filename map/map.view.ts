namespace $.$$ {

	export class $hyoo_life_map extends $.$hyoo_life_map {

		@ $mol_mem
		state( next? : Set<number> ) {
			const snapshot = this.snapshot()
			if( next ) return next
			return new Set( snapshot.split( '~' ).map( v => parseInt( v , 16 ) ) )
		}

		@ $mol_mem
		snapshot_current() {
			return [ ... this.state() ].map( key => key.toString( 16 ) ).join( '~' )
		}

		@ $mol_mem
		cycle() {
			
			if( !this.speed() ) return null

			this.state()
			
			return new this.$.$mol_after_timeout( 1000 / this.speed() || 0 , this.step.bind( this ) )
		}

		@ $mol_action
		step() {
			
			let prev = this.state()
		
			const state = new Set<number>()
			const skip = new Set<number>()

			for( let alive of prev ) {
				
				const ax = $mol_coord_high( alive )
				const ay = $mol_coord_low( alive )
				
				for( let ny = ay - 1 ; ny <= ay + 1 ; ++ny ) for( let nx = ax - 1 ; nx <= ax + 1 ; ++nx ) {

					const nkey = $mol_coord_pack( nx , ny )
					if( skip.has( nkey ) ) continue
					skip.add( nkey )
					
					let sum = 0

					for( let y = -1 ; y <= 1 ; ++y ) for( let x = -1 ; x <= 1 ; ++x ) {
						if( !x && !y ) continue
						if( prev.has( $mol_coord_pack( nx + x , ny + y ) ) ) ++sum
					}
					
					if( sum != 3 && ( !prev.has( nkey ) || sum !== 2 ) ) continue
					state.add( nkey )
					
				}

			}

			this.state( state )

		}

		@ $mol_mem
		population() {
			return this.state().size
		}

		@ $mol_mem
		points_x() {
			return [ ... this.state().keys() ].map(key => $mol_coord_high( key ))
		}

		@ $mol_mem
		points_y() {
			return [ ... this.state().keys() ].map(key => $mol_coord_low( key ))
		}
		
		_draw_start_state = true
		
		@ $mol_mem
		action_cell() {
			const point = this.action_point()
			return $mol_coord_pack(
				Math.round( point.x ) ,
				Math.round( point.y ) ,
			)
		}
		
		draw_start( event: Event ) {
			this._draw_start_state = !this.state().has( this.action_cell() )
		}

		draw( event: Event ) {
			
			const cell = this.action_cell()
			const state = new Set( this.state() )
			
			if( this._draw_start_state ) state.add( cell )
			else state.delete( cell )
			
			this.state( state )
		}

		draw_end( event: Event ) {
			this.draw( event )
		}

		@ $mol_mem
		zoom( next = super.zoom() ) {
			return Math.max( 1 , next )
		}
		
		@ $mol_mem
		shift( next? : $mol_vector_2d< number > ) {
			return next || this.size_real().map( v => v / 2 )
		}

		dom_tree() {
			this.cycle()
			return super.dom_tree()
		}
		
	}

}
