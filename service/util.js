export const deviceInfo = async (window) => {
    // const deviceResponse = fetch("/device");
    // const ipResponse = fetch("/ip");
    // const response = await Promise.all([deviceResponse, ipResponse]);
    // const device: any = await response[0].json();
    // const ipAddress: any = await response[1].json();
  
    const ipAddress = {
      ip: "any",
    };
  
    const getBrandModel = () => {
      const userAgent = navigator.userAgent;
      let brandModel = "unknown";
      if (userAgent.includes("iPhone")) {
        brandModel = "iPhone";
      } else if (userAgent.includes("Samsung")) {
        brandModel = "Samsung";
      } else if (userAgent.includes("Google Pixel")) {
        brandModel = "Google Pixel";
      } else if (userAgent.includes("Huawei")) {
        brandModel = "Huawei";
      } else if (userAgent.includes("Xiaomi") || userAgent.includes("Redmi")) {
        brandModel = "Xiaomi (Redmi)";
      } else if (userAgent.includes("LG")) {
        brandModel = "LG";
      } else if (userAgent.includes("Sony")) {
        brandModel = "Sony";
      } else if (userAgent.includes("Tecno")) {
        brandModel = "Tecno";
      } else if (userAgent.includes("Infinix")) {
        brandModel = "Infinix";
      } else if (userAgent.includes("itel")) {
        brandModel = "itel";
      }
      // Add more conditions to detect other brands
  
      return brandModel;
    };

    const deviceInfo = {
      screen_resolution: `${window.screen.width},${window.screen.height}`,
      available_screen_resolution: `${window.screen.availWidth},${window.screen.availHeight}`,
      system_version: navigator.userAgent,
      brand_model: getBrandModel(),
      system_lang: navigator.language,
      timezone: getTimezone(),
      timezoneOffset: new Date().getTimezoneOffset(),
      user_agent: navigator.userAgent,
      list_plugin: listPlugins(),
      canvas_code: await getCanvasCode(),
      webgl_vendor: getWebGLCode("VENDOR"),
      webgl_renderer: getWebGLCode("RENDERER"),
      audio: await getAudioCode(),
      platform: navigator.platform,
      web_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      // device_name: `${device.browser.name} V${device.browser.version} (${device.os.name} ${device.os.version})`,
      fingerprint: await getFingerprint(),
      // device_id: hashString(
      //   `${device.browser.name} V${device.browser.version} (${device.os.name} ${device.os.version})`
      // ),
      related_device_ids: "",
      ipAddress,
    };
  
    const secretKey = new TextEncoder().encode(ipAddress.ip); //Todo
    const token = await new SignJWT(deviceInfo)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .sign(secretKey);
  
    return token;
  };