import { Component, Fragment, createRef } from "react";

export class UtilitiesPageImageConverter extends Component {
	constructor(props) {
		super(props);

		this.title = "Image Converter";
		this.description = "Convert images to different formats";

		this.inputFileTypeRef = createRef();
		this.extraInfoLabelRef = createRef();

		this.inputFile = null;
		this.inputFileName = null;

		this.outputFile = null;
		this.outputFileName = null;

		this.downloadLinkRef = createRef();
		this.imageOutputRef = createRef();

		this.reader = null;

		this.state = {
			convertFileTypeSelectArrowIsRotated: false,
			isConverting: false,
			isConvertingAllowed: true,
			isError: false
		};
	}

	componentDidMount() {
	}

	// I spent a lot of time making this animation you know
	waitForImageOutputTransitionEnd = () => {
		return new Promise((resolve) => {
			const handleTransitionEnd = () => {
				// Transition has ended, resolve the Promise
				this.imageOutputRef.current.removeEventListener('transitionend', handleTransitionEnd);
				this.setState({ isConvertingAllowed: true });
				resolve();
			};

			this.imageOutputRef.current.addEventListener('transitionend', handleTransitionEnd);
			this.setState({ isConvertingAllowed: false });
		});
	};

	handleConvertButtonClick = async () => {
		if (this.state.isConverting || this.inputFile === null) {
			return;
		}

		if (this.outputFile) {
			this.setState({ isConvertingAllowed: false });
			this.imageOutputRef.current.style.height = "0px";
			await this.waitForImageOutputTransitionEnd();
		}

		this.setState({ isConverting: true, isError: false });

		if (!this.reader) {
			this.reader = new FileReader();

			this.reader.onload = (event) => {
				const img = new Image();
				img.src = event.target.result;
				img.onload = () => {
					const canvas = document.createElement('canvas');
					canvas.width = img.width;
					canvas.height = img.height;
					const ctx = canvas.getContext('2d');
					ctx.drawImage(img, 0, 0);

					const outputFormat = document.querySelector('.ui-select select').value;
					this.outputFileName = this.inputFileName.split('.')[0] + `_${outputFormat}.${outputFormat}`;
					this.outputFile = canvas.toDataURL(`image/${outputFormat}`);

					this.setState({ isConverting: false }, () => {
						// this.downloadLinkRef.current.click();
					});
				};
			};

			this.reader.onerror = (event) => {
				this.setState({ isConverting: false, isError: true });
			};
		}

		this.setState({ isConvertingAllowed: true });
		this.reader.readAsDataURL(this.inputFile);
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
					{this.title}
				</div>
				<div className="utils-description">
					{this.description}
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
								<option value="png">PNG</option>
								<option value="jpg">JPG</option>
								<option value="webp">WEBP</option>
								<option value="bmp">BMP</option>
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
						className={`ui-button ${this.state.isConverting || !this.state.isConvertingAllowed ? 'ui-button-disabled' : ''}`}
						id="convert-button"
						onClick={this.handleConvertButtonClick}
					>
						Convert
					</button>
					<div className="ui-extra-info" ref={this.extraInfoLabelRef}>
						{
							this.state.isConverting ?
								"Converting..." :
								this.state.isError ?
									"Oops... something went wrong with the conversion" :
									this.outputFile ?
										<Fragment>
											<a
												ref={this.downloadLinkRef}
												href={this.outputFile}
												download={this.outputFileName} >
												Download {this.outputFileName}
											</a>
											<img ref={this.imageOutputRef}
												src={this.outputFile}
												alt="whr img"
												style={{ height: "0px" }}
												onLoad={
													() => {
														const width = this.imageOutputRef.current.width;
														const aspectRatio = this.imageOutputRef.current.naturalWidth / this.imageOutputRef.current.naturalHeight;
														const height = width / aspectRatio;
														this.imageOutputRef.current.style.height = height + "px";
													}}
												onTransitionEnd={() => {
													// SCroll intro view
													this.imageOutputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
												}
												}
											/>
										</Fragment > :
										<Fragment />
						}
					</div>
				</div>
			</div>
		);
	}
};

UtilitiesPageImageConverter.displayName = "Image Converter";
UtilitiesPageImageConverter.title = "Image Converter";
UtilitiesPageImageConverter.description = "Convert images to different formats";;