import React from "react";
import axios from "axios";

class SimpleReactFileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      userFolder: "",
      userFiles: [],
      listFiles: [],
      msg: "",
      status: false
    };
  }

  getAllFiles = () => {
    axios
      .get("http://localhost:5000/allfiles")
      .then(res => {
        this.setState({
          userFiles: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getAllFiles();
  }

  folderHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0
    });
  };

  onClickHandler = e => {
    e.preventDefault();
    const data = new FormData();

    data.append("file", this.state.selectedFile);
    // data.append("userfolder", this.state.userFolder);
    // data.append(folder.userFolder);
    console.log(data);
    axios
      .post("http://localhost:5000/checkfolder", data, {
        // receive two    parameter endpoint url ,form data
      })
      .then(res => {
        // then print response status
        this.getAllFiles();
        console.log(res.statusText);
      });
  };

  downloadFileHandler = e => {
    e.preventDefault();
    axios
      .get("http://localhost:5000/download")
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  checkFolderHandler = e => {
    e.preventDefault();
    const folder = {
      userFolder: this.state.userFolder
    };
    axios
      .post("http://localhost:5000/checkfolder2", folder)
      .then(res => {
        if (res.data.status === "success") {
          this.setState({
            status: true,
            msg: res.data.msg
          });
        } else {
          this.setState({
            status: false,
            msg: res.data.msg
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  showFilesHandler = fileName => {
    axios
      .get(`http://localhost:5000/allfiles2/${fileName}`)
      .then(res => {
        console.log(res.data);
        this.setState({
          listFiles: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    let files;
    if (this.state.userFiles.length > 0) {
      files = this.state.userFiles.map(file => (
        <tr key={file}>
          <td>{file}</td>

          <td>
            <p onClick={() => this.showFilesHandler(file)}>Show files</p>
          </td>

          <td>
            <a href={`http://localhost:5000/delete/${file}`} target="_blank">
              Delete
            </a>
          </td>

          {/* <p>{file}</p> */}
          {/* <a href={`http://localhost:5000/download/${file}`} target="_blank">
            download
          </a> */}

          {/* <a href={`http://localhost:5000/mp3files/${file}`} target="_blank">
            Play
          </a> */}
        </tr>
      ));
    }

    let alertMsg = (
      <div className="alert alert-primary text-center" role="alert">
        {this.state.msg}
      </div>
    );

    let upload = (
      <form onSubmit={this.onClickHandler}>
        <h1>File Upload</h1>

        <br />
        <input type="file" name="file" onChange={this.onChangeHandler} />
        <button type="submit">Upload</button>
      </form>
    );
    return (
      <div>
        <form>
          <div className="form-group">
            <input
              type="text"
              name="userFolder"
              className="form-control"
              onChange={this.folderHandler}
              placeholder="Enter folder name"
              disabled={this.state.status}
            />
          </div>

          <button
            onClick={this.checkFolderHandler}
            type="submit"
            className="btn btn-primary"
            disabled={this.state.status}
          >
            check folder
          </button>
        </form>
        {this.state.msg ? alertMsg : ""}
        {this.state.status ? upload : ""}
        <div>
          <table className="table table-bordered mt-5">
            <thead>
              <tr>
                <th>Folder Name</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>{files}</tbody>
          </table>
          {this.state.listFiles.map(fls => (
            <React.Fragment key={fls}>
              <ul>
                <li>{fls}</li>
              </ul>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
}

export default SimpleReactFileUpload;
