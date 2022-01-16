# svelte-deep-reactive-store
Deeply reactive object store for Svelte

# Usage
```javascript
// my-store.js
import reactive from './reactive.js'

export const obj = reactive({ 
	name: 'ehh', 
	deep: { 
		count: 1  // nested property
	} 
});

export function increment() {
	obj.deep.count++; // svelte will react to the change
}

export const myArray = reactive([]);

```

```svelte
<!-- my-component.svelte -->
<script>
	import { obj, myArray, increment } from './my-store.js';
	
	function rename() {
		obj.name = 'kek'; // works here too without the $ prefix
	}
	
	function push() {
		myArray.push('test'); // you don't need to hack (myArray = myArray)
	}
</script>

<h1 on:click={ rename }>Hello {$obj.name}!</h1>
<p on:click={ increment }>
	Count: {$obj.deep.count}
</p>
<div>
	<p on:click={ push }>
		tags:
	</p>
	<ul on:click={ pop }>
		{#each $myArray as item}
			<li>{ item }</li>
		{/each}
	</ul>
</div>

```

# TODO
- [ ] handle object inside arrays/etc
