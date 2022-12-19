namespace $.$$ {

	export class $hyoo_life_map extends $.$hyoo_life_map {

		@ $mol_mem
		alive( next? : Set<number> ) {
			const snapshot = this.snapshot()
			if( next ) return next
			return new Set( snapshot.split( '~' ).filter( Boolean ).map( v => parseInt( v , 36 ) ) )
		}

		@ $mol_mem
		hot( next?: Set<number> ) {
			this.snapshot()
			return next ?? this.alive()
		}

		@ $mol_mem
		snapshot_current() {
			return [ ... this.alive() ].map( key => key.toString( 36 ) ).join( '~' )
		}

		@ $mol_mem
		cycle() {
			
			if( !this.speed() ) return null

			this.alive()
			
			return new this.$.$mol_after_timeout( 1000 / this.speed() || 0 , this.step.bind( this ) )
		}

		@ $mol_action
		step() {
			
			let alive_prev = this.alive()
			let hot_rev = this.hot()
		
			const alive_next = new Set<number>( alive_prev )
			const hot_next = new Set<number>()
			const skip = new Set<number>()

			for( let hot of hot_rev ) {
				
				const hx = $mol_coord_high( hot )
				const hy = $mol_coord_low( hot )
				
				for( let ny = hy - 1 ; ny <= hy + 1 ; ++ny ) for( let nx = hx - 1 ; nx <= hx + 1 ; ++nx ) {

					const nkey = $mol_coord_pack( nx , ny )
					
					if( skip.has( nkey ) ) continue
					skip.add( nkey )
					
					let sum = 0

					for( let y = -1 ; y <= 1 ; ++y ) for( let x = -1 ; x <= 1 ; ++x ) {
						if( !x && !y ) continue
						const coord = $mol_coord_pack( nx + x , ny + y )
						if( alive_prev.has( coord ) ) ++sum
					}
					
					const dead_prev = !alive_prev.has( nkey )
					const dead_next = sum != 3 && ( dead_prev || sum !== 2 )
					
					if( dead_next === dead_prev ) continue
					hot_next.add( nkey )
					
					if( dead_next ) alive_next.delete( nkey )
					else alive_next.add( nkey )
					
				}

			}

			this.alive( alive_next )
			this.hot( hot_next )

		}

		@ $mol_mem
		population() {
			return this.alive().size
		}

		@ $mol_mem
		points_x() {
			return [ ... this.alive().keys() ].map(key => $mol_coord_high( key ))
		}

		@ $mol_mem
		points_y() {
			return [ ... this.alive().keys() ].map(key => $mol_coord_low( key ))
		}
		
		@ $mol_mem
		points_x_sleep() {
			return [ ... this.hot().keys() ].map(key => $mol_coord_high( key ))
		}

		@ $mol_mem
		points_y_sleep() {
			return [ ... this.hot().keys() ].map(key => $mol_coord_low( key ))
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
			this._draw_start_state = !this.alive().has( this.action_cell() )
		}

		@ $mol_action
		draw( event: Event ) {
			
			const cell = this.action_cell()
			const alive = new Set( this.alive() )
			
			if( this._draw_start_state ) alive.add( cell )
			else alive.delete( cell )
			
			this.alive( alive )
			this.hot( new Set([ ... this.hot(), cell ]) )
			
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
			this.hot()
			return super.dom_tree()
		}
		
	}

}
