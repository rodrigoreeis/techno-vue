const vm = new Vue({
  el: '#app',
  data: {
    products: [],
    product: false,
    minicart: [],
    minicartToggle: false,
    messageAlert: 'Item adicionado',
    alertActive: false,
  },
  filters: {
    formatedPrice(value){
      return value.toLocaleString('pt-br',{
        style: 'currency', 
        currency: 'BRL'
      });
    }
  },
  computed: {
    minicartTotal(){
      let total = 0;
      if (this.minicart.length) {
        this.minicart.forEach(({ preco }) => {
          total += preco;
        });
      }
      return total;
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await fetch('../src/api/products.json');
        const data = await response.json();
        this.products = data;
      } catch (error) {
        console.log('bar', error);
      }
    },
    async fetchProduct(id){
      try {
        const response = await fetch(`../src/api/products/${id}/dados.json`);
        const data = await response.json();
        this.product = data;
      } catch (error) {
        console.log('bar', error)
      }
    },
    openModal(id){
      this.fetchProduct(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth" 
      })
    },
    closeModal({ target, currentTarget }){
      if(target === currentTarget){
        this.product = false;
      }
    },
    closeCart({ target, currentTarget }){
      if(target === currentTarget){
        this.minicartToggle = false;
      }
    },
    equateStock(){
      const items = this.minicart.filter(({ id }) => id === this.product.id);
      this.product.estoque -= items.length;
    },
    addItem(){
      this.product.estoque--;
      const { id, nome, preco } = this.product;
      this.minicart.push({id, nome, preco});
      this.alert(`${nome} foi adicionado ao carrinho.`)
    },
    removeItem(index){
      this.minicart.splice(index, 1)
    },
    checkLocalStorage(){
      if(window.localStorage.minicart){
        this.minicart = JSON.parse(window.localStorage.minicart);
      }
    },
    alert(message){
      this.messageAlert = message;
      this.alertActive = true;
      setTimeout(() => {
        this.alertActive = false;
      }, 1200)
    },
    router(){
      const hash = document.location.hash;
      if(hash){
        this.fetchProduct(hash.replace('#', ''))
      }
    }
  },
  watch: {
    minicart(){
      window.localStorage.minicart = JSON.stringify(this.minicart);
    },
    product(){
      document.title = `Techno ${this.product.nome || ''}`;
      history.pushState(null, null, `#${this.product.id || ''}`);
      if (this.product){
        this.equateStock();
      }
    }
  },
  created() {
    this.fetchProducts();
    this.checkLocalStorage();
    this.router();
  }
})
