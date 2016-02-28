var defaultSnippets = [
	{
		name: "Show All Fields",
		code: function () {
			Xrm.Page.ui.controls.forEach(function (control) {
				control.setVisible(true);
			});
		}
    },
	{
		name: "Enable All Fields",
		code: function () {
			Xrm.Page.ui.controls.forEach(function (control) {
				control.setDisabled(false);
			});
		}
    },
	{
		name: "Schema Names",
		code: function () {
			Xrm.Page.ui.controls.forEach(function (control) {
				control.setLabel(control.getName());
			});
		}
    },
	{
		name: "Record Guid",
		code: function () {
			(function () {
				window.prompt("Record Guid :", Xrm.Page.data.entity.getId());
			})();
		}
    },
	{
		name: "Record Url",
		code: function () {
			(function(){
				var params = [Xrm.Page.context.getClientUrl() + "/main.aspx"];
				params.push("?etn=" + Xrm.Page.data.entity.getEntityName());
				params.push("&id=" + Xrm.Page.data.entity.getId());
				params.push("&pagetype=entityrecord");
				window.prompt("Record Url:",params.join(""));
			})();
		}
    }
];