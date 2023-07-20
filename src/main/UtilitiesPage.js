import { Component, createRef } from "react";
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export default class UtilitiesPageBox extends Component {
	render() {
		return (
			<div className="utils-page-box">
				<div className="utils-title">
					{this.props.title}
				</div>
				<div className="utils-description">
					{this.props.description}
				</div>
				{
					this.props.ui.map((ui, index) => {
						const TagName = ui.tag.toLowerCase();

						if (TagName === "div") {
							return (
								<div className="ui-div">
									{ui.content}
								</div>
							);
						}
						else if (TagName === "button") {
							return (
								<button
									className="ui-button"
									onClick={this.props.onButtonClick}
									key={index}
								>
									{ui.content}
								</button>
							);
						}
					})
				}
			</div>
		);
	}
}



export const ffmpegService = async () => {
	const ffmpeg = createFFmpeg({ log: true });

	const readAsArrayBuffer = (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
			reader.readAsArrayBuffer(file);
		});

	// Load the ffmpeg.wasm library
	await ffmpeg.load();

	// Set up the input and output files and run ffmpeg commands
	const processVideo = async (inputFile, outputFileName) => {
		const inputFileData = await readAsArrayBuffer(inputFile);

		console.log(inputFileData);

		await ffmpeg.FS('writeFile', inputFile.name, new Uint8Array(inputFileData));

		await ffmpeg.run('-i', inputFile.name, '-y', outputFileName);

		const data = ffmpeg.FS('readFile', outputFileName);

		return new Blob([data.buffer], { type: 'video/mp4' });
	};

	return { processVideo };
};



export class UtilitiesPageFfmpegConversion extends Component {
	constructor(props) {
		super(props);

		this.inputFileTypeRef = createRef();
		this.extraInfoLabelRef = createRef();

		this.inputFile = null;
		this.inputFileName = null;
		this.outputFile = null;
		this.downloadLink = null;

		this.state = {
			convertFileTypeSelectArrowIsRotated: false
		};

		this.ffmpegService = null;
	}

	componentDidMount() {
		this.downloadLink = document.createElement('a');
	}

	handleConvertButtonClick = async () => {
		if (this.inputFile === null) {
			return;
		}

		if (!this.ffmpegService) {
			this.ffmpegService = await ffmpegService();
		}

		const outputFileName = this.inputFileName.split('.')[0] + '_converted.' + document.querySelector('.ui-select select').value;

		this.ffmpegService.processVideo(this.inputFile, outputFileName)
			.then((processedVideo) => {
				this.outputFile = URL.createObjectURL(processedVideo);
			})
			.then(() => {
				this.downloadLink.href = this.outputFile;
				this.downloadLink.download = outputFileName;
				this.downloadLink.innerHTML = "Download";
				this.downloadLink.click();
				this.extraInfoLabelRef.current.appendChild(this.downloadLink);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	handleFileUpload = (event) => {
		let inputFileName = event.target?.files[0]?.name;
		inputFileName = inputFileName ? inputFileName : "None";
		this.inputFileName = inputFileName;
		this.inputFileTypeRef.current.innerHTML = "Input: " + inputFileName;
		this.inputFile = event.target.files[0];
	};

	render() {
		return (
			<div className="utils-page-box">
				<div className="utils-title">
					FFMPEG Conversion
				</div>
				<div className="utils-description">
					Convert between different file formats using ffmpeg
				</div>
				<div className="ui-flex-column">
					<div className="ui-flex-row">
						<label className="ui-file-input-wrapper">
							<div>Upload File</div>
							<input
								type="file"
								id="file-input"
								onChange={this.handleFileUpload}
							/>
						</label>
						<div ref={this.inputFileTypeRef}>
							Input: None
						</div>
					</div>
					<div className="ui-flex-row">
						<div>Convert to:</div>
						<div className="ui-select">
							<select
								onClick={() => {
									this.setState({ convertFileTypeSelectArrowIsRotated: !this.state.convertFileTypeSelectArrowIsRotated });
								}}
								onBlur={() => {
									this.setState({ convertFileTypeSelectArrowIsRotated: false });
								}}
							>
								<option value="mp4">mp4</option>
								<option value="mp3">mp3</option>
								<option value="wav">wav</option>
								<option value="ogg">ogg</option>
								<option value="webm">webm</option>
								<option value="mkv">mkv</option>
								<option value="mov">mov</option>
								<option value="flv">flv</option>
								<option value="avi">avi</option>
								<option value="wmv">wmv</option>
								<option value="m4a">m4a</option>
								<option value="aac">aac</option>
								<option value="ac3">ac3</option>
								<option value="flac">flac</option>
								<option value="alac">alac</option>
								<option value="wma">wma</option>
								<option value="m4v">m4v</option>
							</select>
							<div className="ui-select-arrow">
								<i
									style={{ transform: this.state.convertFileTypeSelectArrowIsRotated ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%) rotate(360deg)' }}
									className="fa fa-caret-down"
								/>
							</div>
						</div>

					</div>
					<button
						className="ui-button"
						id="convert-button"
						onClick={this.handleConvertButtonClick}
					>
						Convert
					</button>
					<div className="ui-extra-info" ref={this.extraInfoLabelRef}>

					</div>
				</div>
			</div>
		);
	}
};
