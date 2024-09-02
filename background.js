console.log("Setting up download event listeners");

browser.downloads.onCreated.addListener(async (downloadItem) => {
  await browser.notifications.create({
    type: "basic",
    iconUrl: browser.extension.getURL("icon.png"),
    title: "Download Started",
    message: `Download started: ${downloadItem.id}`,
  });

  try {
    await browser.downloads.pause(downloadItem.id);
    console.log(`Download ${downloadItem.id} paused.`);

    await browser.notifications.create({
      type: "basic",
      iconUrl: browser.extension.getURL("icon.png"),
      title: "Download Paused",
      message: `Download ${downloadItem.id} has been paused.`,
    });
  } catch (error) {
    console.error(`Failed to pause download ${downloadItem.id}:`, error);

    await browser.notifications.create({
      type: "basic",
      iconUrl: browser.extension.getURL("icon.png"),
      title: "Pause Failed",
      message: `Failed to pause download ${downloadItem.id}.`,
    });
  }

  const response = await makeRequest(downloadItem);

  if (response.result.item.check == "no") {
    //cancel the download
  } else if (result.item.check == "yes") {
    // resume the download or if in cancel state iniate the download
  }
});

async function makeRequest(downloadItem) {
  console.log("making a request with : ", downloadItem);
  try {
    const response = await fetch("http://localhost:3000/download", {
      method: "POST",
      mode: "cors", // this cannot be 'no-cors'
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item: downloadItem }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    throw Error("An Error Occured while making the request to the server", err);
  }
}
async function createNewDownload(downloadItem) {
  try {
    const url = new URL(downloadItem.url);
    const filename = url.pathname.split("/").pop();

    await browser.downloads.download({
      url: downloadItem.url,
      filename: filename,
      conflictAction: "overwrite",
    });
  } catch (error) {
    console.error(
      `Failed to start new download for ${downloadItem.url}:`,
      error,
    );
  }
}

browser.downloads.onChanged.addListener((delta) => {
  if (delta.state && delta.state.current === "complete") {
    console.log("Download completed:", delta);
    browser.notifications.create({
      type: "basic",
      iconUrl: browser.extension.getURL("icon.png"),
      title: "Download Completed",
      message: `Download completed: ${delta.id}`,
    });
  }
});
