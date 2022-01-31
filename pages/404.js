import appConfig from "../config.json";
import Link from "next/link";
import { Box, Button, Text, TextField, Image } from "@skynexui/components";

function NotFound() {
  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage:
            "url(https://passaportefeliz.com.br/wp-content/uploads/2020/07/dark-netflix-7.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: appConfig.theme.colors.neutrals[700],
          }}
        >
          <Box
            as="form"
            onSubmit={function (event) {
              event.preventDefault();
              //define a próxima página após o submit
              roteamento.push("/chat");
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              <h1>Ops...</h1>
              <h2>Linha do tempo errada</h2>
              <br />
              <p>
                <Link
                  style={{ color: appConfig.theme.colors.primary[500] }}
                  href="/"
                >
                  <Text
                    styleSheet={{
                      color: appConfig.theme.colors.primary[500],
                      cursor: "pointer",
                    }}
                  >
                    Retorne para o presente
                  </Text>
                </Link>
              </p>
            </Text>
          </Box>
            <Box
              styleSheet={{
                borderRadius: "50%",
                marginBottom: "16px",
                width: "166px",
                height: "166px",
                backgroundColor: appConfig.theme.colors.primary[700],
                backgroundImage:
                "url(https://br.web.img3.acsta.net/newsv7/20/07/01/01/34/1863536.jpg)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundBlendMode: "multiply",
              }}
            />
        </Box>
      </Box>
    </>
  );
}

export default NotFound;
