
// init jquery
window.jQuery || document.write(decodeURIComponent('%3Cscript src="js/jquery.min.js"%3E%3C/script%3E'))

$(function () {

    $("#gridContainer").dxDataGrid({
        dataSource: storeFirestore('users'),
        reshapeOnPush: false,
        repaintChangesOnly: true,
        highlightChanges: true,
        allowColumnResizing: true,
        columnResizingMode: "widget",
        columnAutoWidth: true,
        showBorders: true,
        loadPanel: {
            enabled: true
        },
        scrolling: {
            mode: "virtual"
        },
        selection: {
            mode: "multiple"
        },
        // filterRow: {
        //     visible: true,
        //     applyFilter: "auto"
        // },
        searchPanel: {
            visible: true,
            width: 150,
            placeholder: "Search..."
        },
        headerFilter: {
            visible: true
        },
        "export": {
            enabled: true,
            // fileName: "",
            allowExportSelectedData: true
        },
        editing: {
            mode: "batch",
            allowAdding: false,
            allowUpdating: true,
            allowDeleting: false,
            popup: {
                // title: "입력/수정",
                showTitle: true,
                width: 800,
                height: 300,
                position: {
                    my: "center",
                    at: "center",
                    of: window
                }
            },
        },
        columns: [
            // uid는 바꿀 수 없게 하겠다.
            // {caption: "uid", dataField: "id", width: 100, allowEditing: false},
            {caption: "권한", dataField: "permission", width: 100, allowEditing: false},
            {caption: "이름", dataField: "displayName", width: 120, allowEditing: false},
            {caption: "이메일", dataField: "email", width: 180, allowEditing: false},
            {caption: "폰번호", dataField: "phoneNumber", width: 120, allowEditing: false,},
            {caption: "이미지", dataField: "photoUrl", width: 70, allowEditing: false,
                allowFiltering: false, allowSorting: false, cellTemplate: function (container, options) {
                    $("<div>")
                        .append($("<img>", { "src": options.value, width: 30}))
                        .appendTo(container)
                }},
            {caption: "비고", dataField: "etc", width: '100%',},
        ]

    });
});