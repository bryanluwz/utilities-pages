import { Component, Fragment, createRef } from "react";

// These imports are for ffmpeg conversion
import { createFFmpeg } from '@ffmpeg/ffmpeg';
import ProgressBar from "../components/others/ProgressBar";


// FFMPEG Conversion Page and other related functions here
export const ffmpegService = async () => {
	let ffmpeg = createFFmpeg({ log: false });

	const readAsArrayBuffer = (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
			reader.readAsArrayBuffer(file);
		});

	// Load the ffmpeg.wasm library
	if (!ffmpeg.isLoaded()) {
		await ffmpeg.load();
	}

	// Set up the input and output files and run ffmpeg commands
	const processVideo = async (inputFile, outputFileName, setProgress = (...args) => { }) => {
		const inputFileData = await readAsArrayBuffer(inputFile);

		ffmpeg.FS('writeFile', inputFile.name, new Uint8Array(inputFileData));

		ffmpeg.setProgress(({ ratio }) => {
			setProgress(ratio);
		});

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
		this.outputFileName = null;

		this.downloadLinkRef = createRef();
		this.progressBarRef = createRef();

		this.state = {
			convertFileTypeSelectArrowIsRotated: false,
			isConverting: false,
			isError: false
		};

		this.ffmpegService = null;
	}

	componentDidMount() {
	}

	handleConvertButtonClick = async () => {
		if (this.state.isConverting || this.inputFile === null) {
			return;
		}

		this.setState({ isConverting: true, isError: false });

		if (!this.ffmpegService) {
			this.ffmpegService = await ffmpegService();
		}

		const outputFormat = document.querySelector('.ui-select select').value;
		this.outputFileName = this.inputFileName.split('.')[0] + `_${outputFormat}.${outputFormat}`;

		this.ffmpegService.processVideo(
			this.inputFile,
			this.outputFileName,
			(ratio) => {
				this.progressBarRef.current.setProgress(ratio);
			})
			.then((processedVideo) => {
				this.outputFile = URL.createObjectURL(processedVideo);
			})
			.then(() => {
				this.setState({ isConverting: false }, () => {
					this.downloadLinkRef.current.click();
				});
			})
			.catch((error) => {
				console.log(error);
				this.setState({ isConverting: false, isError: true });
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
						className={`ui-button ${this.state.isConverting ? 'ui-button-disabled' : ''}`}
						id="convert-button"
						onClick={this.handleConvertButtonClick}
					>
						Convert
					</button>
					<div className="ui-extra-info" ref={this.extraInfoLabelRef}>
						{
							this.state.isConverting ?
								<ProgressBar ref={this.progressBarRef} progress={0} /> :
								this.state.isError ?
									"Oops... something went wrong with the conversion" :
									this.outputFile ?
										<a
											ref={this.downloadLinkRef}
											href={this.outputFile}
											download={this.outputFileName} >
											Download {this.outputFileName}
										</a> :
										<Fragment />
						}
					</div>
				</div>
			</div>
		);
	}
};
