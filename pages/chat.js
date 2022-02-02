import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect } from 'react';
import { useState } from "react";
import appConfig from '../config.json';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0Mzc0MDkwNCwiZXhwIjoxOTU5MzE2OTA0fQ.Q-qTVBxF_LWiJ_POk7H0rQ64OJU0YeYmetg2xo2vwj0";
const SUPABASE_URL = "https://eehoiicdcplryquagyzs.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem) {
    supabaseClient
        .from('mensagens')
        .on("INSERT", (mensagemInserida) => {
            adicionaMensagem(mensagemInserida.new);
        })
        .subscribe();
}

export default function ChatPage() {
    /*
    Usuário:
    - Usuário digita no campo textarea
    - Aperta enter para enviar
    - Tem que adicionar o texto na listagem
    */

    /*
    Dev:
    - Campo textarea
    - Usar onChange para capturar o valor do textarea e usar setState para atualizar valor da variável
    - Quando ocorrer um enter ou click no botão de enviar, deve salvar a mensagem na lista e apagar o campo textarea
    */
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;

    const [mensagem, setMensagem] = useState("");
    const [listaDeMensagens, setListaDeMensagens] = useState([]);
    // uma boa estratégia de debug é utilizar o estado inicial do useState para injetar valores

    // carrega mensagens do banco de dados (select)
    useEffect(() => {
        supabaseClient
            .from("mensagens")
            .select("*")
            .order("id")
            .then((dados) => { // .then({ data })
                setListaDeMensagens(dados.data);
            });
        escutaMensagensEmTempoReal((novaMensagem) => {
            setListaDeMensagens((valorAtualDaLista) => {
                return [
                    ...valorAtualDaLista,
                    novaMensagem,
                ]
            });
        });
    }, []);


    // função que adiciona mensagem no banco de dados
    function handleNovaMensagem(novaMensagem) {
        // precisa passar o array com os valores que já tinha e o novo item
        // pra isso precisa primeiro espalhar os itens da lista com o ...
        // senão ele iria colocar um array dentro de outro
        const mensagem = {
            id: listaDeMensagens.length + 1,
            de: usuarioLogado,
            texto: novaMensagem,
        }
        // faz o insert com a mensagem escrita e depois apaga a mensagem no textarea
        supabaseClient
            .from("mensagens")
            .insert([mensagem])
            .then(setMensagem(""))
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: "url(https://passaportefeliz.com.br/wp-content/uploads/2020/07/dark-netflix-7.jpg)",
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagens={listaDeMensagens} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            //escutador de evento para capturar tecla pressionada
                            onKeyPress={(event) => {
                                if (event.key == "Enter" && mensagem.length > 0) {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        {/* CallBack */}
                        <ButtonSendSticker
                            onStickerClick={(sticker) =>
                                handleNovaMensagem(":sticker: " + sticker)
                            }
                        />

                        <Button
                            type="submit"
                            label="OK"
                            styleSheet={{
                                borderRadius: '5px',
                                marginLeft: '12px',
                                padding: '6px 8px',
                            }}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                            onClick={(event) => {
                                event.preventDefault();
                                if (mensagem.length > 0) {
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    const lista = props.mensagens;

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}>

            {ExibeMensagens(lista)}

        </Box>
    )
}

function ExibeMensagens(lista) {
    const [largura, setLargura] = useState("20px");
    const [altura, setAltura] = useState("20px")

    while (lista.length == 0) {
        return (
            <p style={{ color: appConfig.theme.colors.primary[400] }}>
                Acionando máquina do tempo...
            </p>
        )
    }
    return (
        lista.map((mensagem) => {
            return (
                <Text
                    onMouseOver={(event) => {
                        setLargura("40px");
                        setAltura("40px")
                    }}
                    onMouseLeave={(event) => {
                        setLargura("20px");
                        setAltura("20px")
                    }}
                    key={mensagem.id}
                    tag="li"
                    styleSheet={{
                        borderRadius: '5px',
                        padding: '6px',
                        marginBottom: '12px',
                        hover: {
                            backgroundColor: appConfig.theme.colors.neutrals[700],
                        }
                    }}
                >
                    <Box
                        styleSheet={{
                            marginBottom: '8px',
                        }}
                    >

                        <Image
                            styleSheet={{
                                borderRadius: '50%',
                                display: 'inline-block',
                                marginRight: '8px',
                                width: largura,
                                height: altura,
                                transitionDuration: "1s",
                            }}
                            src={`https://github.com/${mensagem.de}.png`}
                        />
                        <Text tag="strong">
                            {mensagem.de}
                        </Text>
                        <Text
                            styleSheet={{
                                fontSize: '10px',
                                marginLeft: '8px',
                                color: appConfig.theme.colors.neutrals[300],
                            }}
                            tag="span"
                        >
                            {(new Date().toLocaleDateString())}
                        </Text>
                    </Box>
                    {/* verifica se é sticker ou texto observando se inicia com :sticker: */}
                    {mensagem.texto.startsWith(":sticker:")
                        ? (
                            <Image src={mensagem.texto.replace(":sticker:", "")} style={{ maxWidth: "200px" }} /> //retira a palavra sticker, sobrando só a url
                        )
                        : (
                            mensagem.texto
                        )}

                </Text>
            );
        })
    )
}