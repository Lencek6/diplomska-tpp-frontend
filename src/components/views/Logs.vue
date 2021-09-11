<template>
    <div id="psd2-logs" class="text-start w-100">
        <Table :table-data="errors" bordered small striped :fields="fields" :html-field="htmlField" :loader="loader"
               caption="<i class='fa fa-clipboard mr-2'></i>Tabela napak"></Table>
    </div>
</template>

<script>
    import Table from "../shared/Table";
    import psd2_api from "../../vuex/api/psd2";

    export default {
        name: "Logs",
        components: {
            Table
        },
        data () {
            return {
                errors: [],
                fields: [
                    {key: 'id', label: 'ID', sortable: true, search: true},
                    {key: 'name', label: 'Ime napake', sortable: true, search: true},
                    {key: 'description', label: 'Opis napake', sortable: true, search: true},
                    {key: 'createdAt', label: 'Ustvarjeno', sortable: true, search: true},
                ],
                htmlField: [
                    {
                        key: 'htmlField',
                        label: 'Akcije',
                        detailsVariant: 'custom-buttons',
                        details: [
                            {key: 'stack', label: 'Sklad'},
                            {key: 'tppMessage', label: 'TPP sporočilo'}
                        ]
                    }
                ]
            }
        },
        async mounted() {
            this.errors = await psd2_api.errorLogs();
        }
    }
</script>

<style scoped>

    >>> nav > ul {
        margin-bottom: 0;
    }

    >>> .custom-footer-div {
        align-items: center;
    }

    >>> .page-item.active > button {
        background-color: rgba(13, 110, 253, 0.59);
        border-color: rgba(13, 110, 253, 0.59);
    }

    >>> .page-item > button {
        color: black
    }


    >>> .details-button {
        width: 150px;
    }

    >>> .sr-only {
        display: none;
    }

</style>
