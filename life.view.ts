namespace $.$$ {

	export class $hyoo_life extends $.$hyoo_life {

		title() {
			return super.title().replace( '{population}' , `${ this.population() }` )
		}

		store_link() {
			return this.$.$mol_state_arg.make_link({ snapshot : this.snapshot_current() })
		}
		
		@ $mol_mem
		speed( next = 0 ) {
			if( next ) this.$.$mol_dom_context.location.href = this.$.$mol_state_arg.make_link({ snapshot : this.snapshot_current() })
			return next
		}

		snapshot() {
			return this.$.$mol_state_arg.value( 'snapshot' ) ?? super.snapshot()
		}

	}

}
