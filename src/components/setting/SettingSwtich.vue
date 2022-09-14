<template>
    <div id="switch-container">
        <div id="switch-label" class="noselect">
            {{ display }}
        </div>
        <div id="switch-action">
            <Toggle v-model="active" id="switch" @change="onSwitchedCallback">
            </Toggle>
        </div>  
    </div>
</template>

<script>
import Toggle from '@vueform/toggle'
import '@/assets/css.css'
export default {
    name: 'SettingSwitch',

    props: ['active', 'display', 'onSwitchedCallback'],

    components: {
        Toggle
    },
}
</script>

<style scoped>
    #switch-container {
        color: var(--text-sample-comp-normal);
        font-size: 18px;
        display: flex;
        flex-direction: row;
        padding: 0.5rem;
        margin: 0.5rem;
        margin-left: 2.5rem;
        margin-right: 2.5rem;
        border: var(--border-sample-comp-black);
        border-radius: 0.5em;
        border-style:ridge;
        background-color: var(--bg-sample-comp-black);
        box-shadow: 5px 4px 5px var(--bg-sample-comp-shadow);
        transition: 0.1s;
    }
    #switch-label {
        display: flex;
        flex: 1;
    }
    #switch-action {
        margin-right: 0.2rem;
    }
    #switch {
        padding: -0.1rem;
    }
</style>
<style src="@vueform/toggle/themes/default.css"></style>