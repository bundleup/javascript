type EmbedEventData = {
  id: string;
  provider: string;
  href: string;
  width: number;
  height: number;
};

(function (window, document) {
  const embeds = new Map<string, NodeListOf<HTMLIFrameElement>>();

  function setupEmbeds(data: EmbedEventData) {
    const iframes = document.querySelectorAll<HTMLIFrameElement>(
      'iframe[src^="' + data.href + '"]'
    );

    iframes.forEach(function (iframe) {
      // if the iframe has already been setup, skip it
      if (iframe.dataset.embedderId) {
        return;
      }

      iframe.setAttribute("scrolling", "no");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allow", "autoplay; fullscreen");
      iframe.setAttribute("allowfullscreen", "");

      iframe.style.height = "100%";
      iframe.style.width = "100%";
      iframe.style.border = "none";
      iframe.style.display = "block";

      iframe.classList.add("bundleup-iframe");
      iframe.classList.add(`bundleup-iframe--${data.provider}`);
    });

    // store the iframes
    embeds.set(data.id, iframes);

    return iframes;
  }

  function resizeEmbeds(data: EmbedEventData) {
    let iframes = embeds.get(data.id);

    // if the iframe hasn't been setup yet, do it now
    if (!iframes) {
      iframes = setupEmbeds(data);
    }

    // resize the iframes
    iframes.forEach(function (iframe) {
      iframe.style.height = `${data.height}px`;
      iframe.style.width = `${data.width}px`;
    });
  }

  window.addEventListener(
    "message",
    function (event) {
      var data = event.data;

      switch (data.event) {
        case "embed:init":
          setupEmbeds(data);
          break;

        case "embed:resize":
          resizeEmbeds(data);
          break;
      }
    },
    false
  );

  window.addEventListener(
    "resize",
    function () {
      embeds.forEach(function (iframes) {
        iframes.forEach(function (iframe) {
          iframe.style.height = "100%";
        });
      });
    },
    false
  );
})(window, document);
