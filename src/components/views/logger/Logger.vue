<template>
    <div id="psd2-logger">
        <b>Logger</b>
        <div id="logger-content">
            <div v-for="(log, index) in logs" :key="index" class="message">
                {{log.message}}
                <b-spinner variant="primary" v-if="log.status === 'loading'" small></b-spinner>
                <b-icon v-if="log.status === 'done'"  icon="check-circle" class="icon-done"></b-icon>
                <b-icon v-if="log.status === 'failed'"  icon="exclamation-circle" class="icon-failed"></b-icon>
            </div>
        </div>
        <div id="delete-logs" style="text-align: left">
        <b-button @click="clearLogs" class="mt-2" variant="danger" size="sm"><b-icon icon="trash" style="color: white; margin-right: 0.3rem"></b-icon>Počisti loge</b-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Logger",
        props: {
            logs: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            // clear logs
            clearLogs(){
                this.$emit('clear-logs');
            }
        },
        // When component is updated set scrollbar to last element (chat effect)
        updated() {
            let messageBody = document.querySelector('#logger-content');
            if(messageBody.lastChild) messageBody.lastChild.scrollIntoView({behavior: 'smooth'});
        }
    }
</script>

<style scoped>

    .icon-done {
        color: #4dbd74;
    }

    .icon-failed {
        color: rgba(255, 63, 63, 0.7);;
    }

    #psd2-logger {
       height: 100%;
    }

    #logger-content {
        height: 280px;
        background-color: #eeecec;
        text-align: left;
        padding: 0.5rem;
        overflow-y: auto;
        border-radius: 5px;
    }

    .message {
        max-width: max-content;
        border-radius: 5px;
        margin-bottom: 0.2rem;
        background-color: #aee3f8;
        padding: 0.2rem;
    }

</style>
