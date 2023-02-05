let XLSX = require("xlsx");

module.exports.generateXLSX = ({ club, events }) => {
  let event = JSON.parse(JSON.stringify(events));
  let s = 0,
    e,
    ss = [],
    g = [],
    v = [];

  for (j = 0; j < event.length; j++) {
    event[j].participant[0].captainemail = event[j].captainemail;
    event[j].participant[0].college = event[j].college;
    event[j].participant[0].city = event[j].city;
    event[j].participant[0].teamname = event[j].teamname;
    event[j].participant[0].branch = event[j].branch;
    delete event[j].branch;
    delete event[j].college;
    delete event[j].teamname;
    delete event[j]._id;
    delete event[j].city;
    delete event[j].captainemail;

    v.push(event[j].participant);
    g.push(...v[j]);
  }
  for (i = 0; i < g.length; i++) {
    delete g[i]["_id"];
  }

  for (let i = 0; i < v.length; i++) {
    if (!s) {
      s = 1;
      e = s + v[i].length - 1;
    } else {
      s = e + 1;
      e = s + v[i].length - 1;
    }
    for (let j = 5; j <= 9; j++) {
      ss.push({ s: { r: s, c: j }, e: { r: e, c: j } });
    }
  }

  const worksheet = XLSX.utils.json_to_sheet(g);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

  XLSX.utils.sheet_add_aoa(
    worksheet,
    [
      [
        "Name",
        "Email",
        "Phone",
        "Whatsapp",
        "Gender",
        "Captain Email",
        "College",
        "City",
        "Team Name",
        "Branch"
      ]
    ],
    {
      origin: "A1"
    }
  );

  worksheet["!merges"] = ss;
  const filename = club + Date.now() + ".xlsx";
  XLSX.writeFile(workbook, filename, { compression: true });
  return filename;
};
