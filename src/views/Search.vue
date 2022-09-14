<template>
  <div id="search">
    <div class="search-searchbar" contenteditable="true">
      <input
        class="search-input"
        v-model="search"
        required
        v-on:keyup.enter="() => updateSearch(search)"
      />
      <h1 class="input-placeholder">Search</h1>
    </div>
    <div v-if="searching || loading">
      <div class="loading">
        <loading v-model:active="loading" loader="dots" :can-cancel="false">
        </loading>
      </div>
    </div>
    <div
      v-if="searchedSamples[0] !== undifined"
      style="background-color: var(--right-bg-black-color)"
    >
      <div
        class="scroll"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="pageLoading"
        infinite-scroll-distance="100"
        style="background-color: var(--right-bg-black-color)"
      >
        <div v-for="s in needToDisplay" :key="s">
          <SampleComponent
            v-if="s"
            :sample="s"
            :onStarclickCallback="
              () => {
                starSingleSample(s);
              }
            "
          ></SampleComponent>
        </div>
      </div>
      <loading v-model:active="pageLoading" loader="dots" :can-cancel="false">
      </loading>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import SampleComponent from "@/components/data/SampleComponent.vue";
import { mapState, mapActions } from "vuex";
import "@/assets/css.css";

export default {
  name: "Search",
  components: { Loading, SampleComponent },
  data() {
    return {
      search: "",
      pageLoading: false,
      pageCount: 20,
      vptr_l: 0,
      vptr_r: this.pageCount,
      needToDisplay: [],
    };
  },
  computed: {
    ...mapState([
      "samples",
      "loading",
      "currentLoadNum",
      "searchedSamples",
      "searching",
    ]),
  },
  methods: {
    ...mapActions([
      "updateSamplesAction",
      "initSearched",
      "searchSamplesRegular",
      "loadMoreRandom",
      "starSample",
    ]),
    async starSingleSample(sample) {
      try {
        await this.starSample(sample);
        const i = this.searchedSamples.find(
          (i) => i.samplePath === sample.samplePath
        );
        const u = this.needToDisplay.findIndex(
          (i) => i.samplePath === sample.samplePath
        );
        this.needToDisplay[u] = i;
      } catch (err) {
        this.$toast.open({
          message: err,
          type: "error",
        });
      }
    },
    updateSearch(str) {
      this.vptr_l = 0;
      this.vptr_r = this.pageCount;
      this.needToDisplay.length = 0;
      if (str === "") {
        this.initSearched();
      } else {
        this.searchSamplesRegular(str);
      }

      this.vptr_r =
        this.searchedSamples.length < this.pageCount
          ? this.searchedSamples.length
          : this.pageCount;
      for (let i = this.vptr_l; i < this.vptr_r; i++) {
        this.needToDisplay.push(this.searchedSamples[i]);
      }
    },
    loadMore: function () {
      if (this.searchedSamples.length < this.pageCount) {
        return;
      }
      this.pageLoading = true;
      if (this.search === "") {
        this.loadMoreRandom();
      }

      setTimeout(() => {
        this.vptr_l = this.vptr_r;
        this.vptr_r += this.pageCount;
        for (
          let i = this.vptr_l;
          i < this.vptr_r && i < this.searchedSamples.length;
          i++
        ) {
          this.needToDisplay.push(this.searchedSamples[i]);
        }
      }, 500);
      this.pageLoading = false;
    },
    debugEmptyFunc() {},
  },
  async mounted() {
    this.updateSamplesAction();
    this.initSearched();
    this.needToDisplay = this.searchedSamples;
  },
};
</script>

<style scoped>
.search-searchbar {
  position: relative;
  display: flex;
  flex-direction: row;
  margin-top: 4em;
  margin-left: 2.3rem;
  margin-right: 0.5rem;
}

.search-input {
  border: 0;
  color: var(--text-searchbar-normal);
  display: flex;
  width: 100%;
  border: none;
  font-size: 20px;
  font-weight: lighter;
  outline: none;
  padding: 5px;
  border-bottom: 2px solid rgb(131, 131, 131);
  box-shadow: none;
  background: transparent;
}
.search-searchbar > input:focus,
.search-searchbar > input:valid {
  border-bottom: 1.5px solid rgb(115, 138, 214);
}
.search-searchbar > input:focus ~ h1,
.search-searchbar > input:valid ~ h1 {
  transform: translateY(-35px);
  color: rgb(114, 137, 214);
  font-size: 15px;
}
.input-placeholder {
  color: var(--text-searchbar-normal);
  font-size: 25px;
  display: inline-block;
  position: absolute;
  bottom: -8px;
  font-weight: 100;
  letter-spacing: 0.8px;
  pointer-events: none;
  transition: all 0.2s ease;
}
</style>